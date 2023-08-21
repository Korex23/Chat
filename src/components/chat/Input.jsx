import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { ChatContext } from "./ChatContext";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage, auth } from "../../firebase/config";
import React, { useContext, useState } from "react";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);

  // ...

  const handleTextareaChange = (event) => {
    setText(event.target.value);
  };
  const { data } = useContext(ChatContext);
  const currentUser = auth.currentUser;

  const handleImgChange = (e) => {
    const selectedImg = e.target.files[0];
    if (selectedImg) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (selectedImg.size > maxSize) {
        alert("File size exceeds the maximum limit (5MB).");
        return;
      }

      setImg(selectedImg);

      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImgPreview(e.target.result);
      };
      reader.readAsDataURL(selectedImg);
    }
  };

  const handleSend = async () => {
    if (!text && !img) {
      // Don't send a message if both text and image are empty
      return;
    } else if (img) {
      setIsUploading(true); // Set uploading to true to prevent further image selection

      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          // Handle error
          setIsUploading(false); // Reset uploading state
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });

            setIsUploading(false); // Reset uploading state after successful upload
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "chatdetails", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "chatdetails", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setImgPreview(null);
  };
  return (
    <div className="input">
      <textarea
        className="break-word-textarea"
        placeholder="Type something..."
        autocorrect="on"
        value={text}
        onChange={handleTextareaChange}
      ></textarea>
      {imgPreview && (
        <img
          src={imgPreview}
          alt="Image Preview"
          style={{ maxWidth: "100px", maxHeight: "100px" }}
        />
      )}
      <div className="send">
        {/* <input
          type="file"
          style={{ display: "none" }}
          id="pic"
          accept=".doc, .docx, .pdf, .txt, audio/*, .csv"
        />
        <label htmlFor="pic">
          <Attachment />
        </label>
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleImgChange}
          accept="image/*"
        />
        <label htmlFor="file">
          <Img />
        </label> */}
        <button onClick={handleSend}>
          <Send />
        </button>
      </div>
    </div>
  );
};
const Attachment = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 20 20"
    >
      <path
        fill="#3a605b"
        d="M9.5 19.75a4.25 4.25 0 0 1-4.25-4.25V9a2.75 2.75 0 0 1 5.5 0v6h-1.5V9a1.25 1.25 0 0 0-2.5 0v6.5a2.75 2.75 0 0 0 5.5 0V4a2.25 2.25 0 0 0-4.5 0v1h-1.5V4a3.75 3.75 0 0 1 7.5 0v11.5a4.25 4.25 0 0 1-4.25 4.25z"
      />
    </svg>
  );
};

const Send = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 16 16"
    >
      <path
        fill="#3a605b"
        d="M1.724 1.053a.5.5 0 0 0-.714.545l1.403 4.85a.5.5 0 0 0 .397.354l5.69.953c.268.053.268.437 0 .49l-5.69.953a.5.5 0 0 0-.397.354l-1.403 4.85a.5.5 0 0 0 .714.545l13-6.5a.5.5 0 0 0 0-.894l-13-6.5Z"
      />
    </svg>
  );
};

const Img = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 16 16"
    >
      <g fill="#3a605b">
        <path d="M4.502 9a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3z" />
        <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773l3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
      </g>
    </svg>
  );
};
export default Input;

const handleSubmit = async (e) => {
  setLoading(true);
  e.preventDefault();
  const displayName = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;
  const file = e.target[3].files[0];
  try {
    //Create user
    const res = await createUserWithEmailAndPassword(auth, email, password);

    //Create a unique image name
    const date = new Date().getTime();
    const storageRef = ref(storage, `${displayName + date}`);

    await uploadBytesResumable(storageRef, file).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        try {
          //Update profile
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });
          //create user on firestore
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          //create empty user chats on firestore
          await setDoc(doc(db, "userChats", res.user.uid), {});
          navigate("/");
        } catch (err) {
          console.log(err);
          setErr(true);
          setLoading(false);
        }
      });
    });
  } catch (err) {
    setErr(true);
    setLoading(false);
  }
};

import { initializeApp } from 'firebase/app'
import { getFirestore,collection, getDocs, addDoc, onSnapshot, doc, setDoc, getDoc, query, orderBy, serverTimestamp, limit } from 'firebase/firestore'
import { createUserWithEmailAndPassword, getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut } from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyAkQ7wn6yIdjsQDvX2aTZ59JNeGTu-XhoA",
    authDomain: "guidelist-7da44.firebaseapp.com",
    projectId: "guidelist-7da44",
    storageBucket: "guidelist-7da44.appspot.com",
    messagingSenderId: "703637928507",
    appId: "1:703637928507:web:c1293a2918d60f75b97a1e"
  };
 const myList = document.querySelector('.accordion');
 const LoggedInList = document.querySelectorAll('.logged--in');
 const LoggedOutList = document.querySelectorAll('.logged--out');
 const createForm = document.querySelector('.createForm');
 const AccountDetails = document.querySelector('.accountDetails');
 const button = document.querySelector('.mybtn');
  initializeApp(firebaseConfig)
  const auth = getAuth()
  const db = getFirestore()
  const colRef = collection(db,'MovieList')
  let q = query(colRef,orderBy('createdAt'));

//   SignUp
const SignUpForm = document.querySelector('.signup');
SignUpForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const email = SignUpForm.signupEmail.value
    const pass = SignUpForm.signupPass.value
    createUserWithEmailAndPassword(auth,email,pass)
    .then((cred)=>{
     const docRef =  doc(db,'users',cred.user.uid)
   return setDoc(docRef,{
        bio: SignUpForm.bio.value
    });
}).then(()=>{
    SignUpForm.reset()
 })
})

// LogIn

const LogInForm = document.querySelector('.login');
LogInForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const email = LogInForm.loginEmail.value
    const pass =  LogInForm.loginPass.value
    signInWithEmailAndPassword(auth,email,pass)
    .then((cred)=>{
        LogInForm.reset()
    })
})
// LogOut
const logout = document.querySelector('#logOut');
logout.addEventListener('click',()=>{
    signOut(auth)
})

// Authentication State
onAuthStateChanged(auth,(user)=>{
    if(user){
        // Getting Documents
        onSnapshot(q,(snapshot)=>{
                 setupGuide(snapshot.docs)
                 setupUI(user)
        });
    }else{
        setupGuide([])
        setupUI()
    }
})

createForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    addDoc(colRef,{
        Title: createForm.title.value,
        region: createForm.content.value,
        createdAt: serverTimestamp(),
    }).then(()=>{
        createForm.reset()
    }).catch((err)=>{
        console.log(err.message)
    })
})

const setupGuide = ((data)=>{
    if(data.length){
        let html = ""
        data.forEach((doc=>{
        const list = doc.data()
          const div = `
          <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
              ${list.Title}
            </button>
          </h2>
          <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">${list.region}
          </div>
        </div>
        </div>
          `
          html += div;
        }))
        myList.innerHTML = html;

    }else{
        myList.innerHTML = `<h3 class="text-center py-3 text-danger">Login to View Movies.</h3>`
    }
})

const setupUI=(user)=>{
      if(user){
        // account info
        const getInfo = doc(db,'users',user.uid)
        getDoc(getInfo).then((doc)=>{

            const li = `<h6>Email :${user.email}</h6>
                         <h5>${doc.data().bio}</h5>`
            AccountDetails.innerHTML = li;
             
        })
        LoggedInList.forEach((item)=>{
            item.style.display = "inline-block"
        })
        LoggedOutList.forEach((item)=>{
            item.style.display = "none"
        })
      }else{
        AccountDetails.innerHTML = '';
        LoggedInList.forEach((item)=>{
            item.style.display = "none"
        })
        LoggedOutList.forEach((item)=>{
            item.style.display = "inline-block"
        })
      }
}


button.addEventListener('click',getMore)
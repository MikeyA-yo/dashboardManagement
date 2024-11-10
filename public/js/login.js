const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit',async function(event) {
    event.preventDefault();

    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;
    const res = await fetch("/api/v1/users/login", {
        method: "POST",
        credentials:"include",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({username:loginUsername, password:loginPassword})
    });

    
    if(res.ok){
        const user_ =await res.json();
        localStorage.setItem('loggedInUser', JSON.stringify(user_))
        localStorage.setItem('user',JSON.stringify(user_.user))
        localStorage.setItem("token", document.cookie.split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]);
        window.location.href = 'index.html';
    } else{
        alert('Invalid username or password!');
    }
    // const user = JSON.parse(localStorage.getItem('user'));

    // if (user && user.username === loginUsername && user.password === loginPassword) {
    //     localStorage.setItem('loggedInUser', JSON.stringify(user));
    //     window.location.href = 'index.html';
    // } else {
    //     alert('Invalid username or password!');
    // }
});
const validateEmail = (email) =>{
    return String(email)
    .toLowerCase()
    .match(  
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
         );
}

const isValidPassword= (password) =>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    return regex.test(password)
    
}


const userDataValidate = ({name, email,username,password})=>{
    return new Promise((resolve , reject)=>{
        // console.log("helooo", isValidPassword(password));
         console.log({name, email,username,password});
        if(!name || !email || !username || !password)
            reject("Missing user data")

        if(typeof username !== 'string') reject ('name is not text')
        if(typeof email !== 'string') reject ('email is not text')
        if(typeof username !== 'string') reject ('username is not text')
        if(typeof password !== 'string') reject ('password is not text')

        if(!validateEmail(email)) reject ('email is not valid')
        if(!isValidPassword(password)) reject("Password should have a-z , A-Z , 0-9, and special char , length>8")
            
      

        resolve()
    })

}

module.exports = {userDataValidate}
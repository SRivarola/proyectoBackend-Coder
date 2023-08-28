import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const initialValues = {
    mail: '',
    password: ''
}

const Login = () => {

    const [data, setData] = useState(initialValues)
    const [errorMessage, setErrorMessage] = useState(null) 

    const navigate = useNavigate()

    const handleChange = (e) => {
        const name = e.target.name
        setData({
            ...data,
            [name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(data.mail && data.password){
            try {
                const response = await axios.post('http://localhost:8080/api/auth/login', data)
                if(response.data.success){
                    navigate('/new_product')
                }
            } catch (error) {
                setErrorMessage(error.response.data.message)
            }
        } else {
            setErrorMessage('Mail and password are required')
        }

        // else {
        //     if(data.name && data.mail && data.password) {
        //         try {
        //             const response = await axios.post('http://localhost:8080/api/auth/register', data)
        //             if(response.status === 201){
        //                 navigate('/products')
        //             }
        //         } catch (error) {
        //             setErrorMessage(error.response.data.message)
        //         }
        //     } else {
        //         setErrorMessage('Name, mail and password are required')
        //     }
        // }
    } 

  return (
        <form className="w-full mt-4 px-10 flex flex-col gap-2" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex relative">
                <label className="font-semibold">Email</label>
                <input 
                    className="px-4 w-full ml-3 border-b-2 transition-all duration-75 focus:outline-none focus:border-b-black"
                    name="mail" 
                    type="mail"
                    placeholder="instert your mail"
                    value={data.mail}
                    onChange={(e) => handleChange(e)}
                    required
                />
            </div>
            <div className="flex relative">
                <label className="font-semibold">Password</label>
                <input 
                    className="px-4 w-full ml-3 border-b-2 transition-all duration-75 focus:outline-none focus:border-b-black"
                    name="password" 
                    type="password"
                    placeholder="insert a password"
                    value={data.password}
                    onChange={(e) => handleChange(e)}
                    required
                />
            </div>
            {
                errorMessage ? (
                    <p className="text-center mt-2 text-red-600">*{errorMessage}</p>
                ) : (
                    ''
                )
            }
            <div className="w-full flex justify-center mt-5">
                <input 
                    type="submit" 
                    className="cursor-pointer text-white bg-black px-3 py-1 rounded font-semibold" 
                    value='LOGIN'
                />
            </div>
        </form>
  )
}
export default Login
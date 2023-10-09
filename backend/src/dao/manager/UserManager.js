import fs from 'fs';

export default class AuthManager {
    constructor(path){
        this.path = path;
    }
    async read() {
        try {
            if(fs.existsSync(this.path)){
                const response = await fs.promises.readFile(this.path, 'uft-8');
                console.log(response)
                const parseResponse = JSON.parse(response);
                return {
                    message: "User found",
                    response: parseResponse
                }
            } else {
                return null;
            }
        } catch (error) {
            console.log(err)
        }
    }
    async readOne() {
        console.log("first")
    }
    register(){
    }
    login(){}
    logout(){}
    update(){}
    delete(){}
}
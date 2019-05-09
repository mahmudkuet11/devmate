import Swal from 'sweetalert2';

export default class Password{
    static ask(){
        return new Promise(async (resolve, reject) => {
            const {value: password} = await Swal.fire({
                title: 'Enter Your Password',
                input: 'password',
                showCancelButton: true,
            });

            if(password === undefined){
                reject();
            }

            resolve(password);
        });

    }
}
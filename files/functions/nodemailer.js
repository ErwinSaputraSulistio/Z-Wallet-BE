const nm = require('nodemailer')

// nodemailer - account to send email
const senderAccount = nm.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_MAIL,
    pass: process.env.NODEMAILER_PASS
  }
})

exports.sendEmail = (token, email, name) => {
   const sendThisMail = {
      from: 'ciwin.tickitz@gmail.com',
      to: email,
      subject: 'Z-Wallet: Account Verification',
      html:
         `<!DOCTYPE html>
         <html lang="en">
            <head>
               <meta charset="UTF-8">
               <meta http-equiv="X-UA-Compatible" content="IE=edge">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>Document</title>
               <style>
               .container{
                  margin: auto;
                  text-align: center;
                  width: 100%;
               }
               .verifyLink {
                  display: block;
                  margin: auto;
                  text-decoration: none;
                  width: 270px;
                  transition-duration: 0.5s;
               }
               .verifyLink:hover {opacity: 0.5}
               .verifyBtn{
                  background: #6379F4;
                  border-radius: 15px;
                  color: white;
                  font-family: 'Courier New';
                  font-size: 20px;
                  font-weight: bold;
                  padding: 20px;
                  text-align: center;
                  width: 230px;
               }
               </style>
            </head>
            <body>
               <div class="container">
                  <img style="width: 240px; height: 80px;" src="https://image.myanimelist.net/ui/uf6p6rEk2dlZoh8DIyYQTScPXcYWVkorZzR5QFff8Dz3qY2oXvvW5x3Hrb-W5JxGHRwmguU8B08LZEEOtbv2G3WKIJ9sNYmr_hbsa72u_rSA04XHa2uGxv_npt3alTiqCO1wZi7NrJbnS1vOPJyjoZkSTvU9Syn4esm53zmf6UE"/>
                  <p style="font-size: 15px;">Halo ${name}, terima kasih sudah mempercayai Z-Wallet sebagai sarana transfer saldo kamu! Agar kamu bisa login dan mengakses akun kamu lebih lanjut, harap verifikasi akun kamu terlebih dahulu yah dengan cara menekan tombol verifikasi di bawah ini :</p>
                  <div style="margin: auto; margin-top: 40px; width: 100%;">
                     <a class="verifyLink" href="http://localhost:2345/v1/users/verify/${token}"><div class="verifyBtn">Verifikasi Akun</div></a>
                  </div>
               </div>
            </body>
         </html>`
         // '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT19EDf-1IB_C58IMPHisw1geAsdKW52nnqfo3R3LGDI8IIZNb338foPjHNLcDWDZ_82ZA&usqp=CAU">'
         // + '<h1>Halo, umm... Aku masih belum kenal kamu, nih!</h1>'
         // + '<p>Jadi untuk sementara aku panggil ' + realName + ' aja yah ~</p>'
         // + '<p>' + realName + ', Langkah pertama kamu sebagai Moviegoers Tickitz udah berhasil, nih!</p>'
         // + '<p>Sekarang saatnya untuk memulai langkah kedua, yaitu login! Apa kamu sudah siap?</p>'
         // + '<p>Silahkan tekan tombol <a href="https://ciwin-react-tickitz-arkademy.netlify.app/login">LOGIN</a> ini untuk segera login dengan akun baru kamu,</p>'
         // + '<p>Sekalian jangan lupa verifikasi nama asli kamu nanti yah, ada di dalam Setting kok ~ biar aku tau nanti mau manggil kamu apa nih ^^</p><br>'
         // + '<p>Salam hangat,</p><br>'
         // + '<h3>Tickitz</h3>'
   }
   senderAccount.sendMail(sendThisMail, (err, info) => {
      if (err) { console.log(err) } 
      else { console.log('Email berhasil di kirim ke ' + email) }
   })
}

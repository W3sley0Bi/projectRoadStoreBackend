const { PDFDocument, drawRectangle, rgb, degrees, drawImage } = require('pdf-lib')
 const fs = require('fs/promises');
// const { db } = require('../../modules/DBConnection')
const nodemailer = require('nodemailer');
const config = require("../../../config");
// const { google }= require("googleapis")

async function fillPDF(req, res, next) {
let bodyData =  JSON.parse(req.body.pdfData)
const imageData = JSON.parse(req.body.images)
console.log(req.body);
try{
const pdfData = await fs.readFile('public/LK-Fillable-3.pdf');
const pdfDoc = await PDFDocument.load(pdfData);
const fieldNames = pdfDoc.getForm().getFields().map((f)=> f.getName());
//console.log({fieldNames})

 const form = pdfDoc.getForm()

 form.getTextField('196525635').setText(bodyData.field1)
 form.getTextField('196525636').setText(bodyData.field2)
 form.getTextField('196525637').setText(bodyData.filedDate1)
 form.getTextField('196525639').setText(bodyData.filedDate2)
 form.getTextField('196525638').setText(bodyData.filedDate3)
 form.getTextField('196525640').setText(bodyData.filedDate4)


 switch (bodyData.radioValue) {
  case "radio1":
    //first radio
    form.getCheckBox('radio_group_10wgzk').check(bodyData.radioValue);
    break;
  case "radio2":
     //second radio
      form.getCheckBox('radio_group_11hgaz').check(bodyData.radioValue);
    break;  
  case "radio3":
      //third radio
    form.getCheckBox('radio_group_12egcu').check(bodyData.radioValue);
    break;
 
  default:
    break;
 }

 await pdfSignature(form,pdfDoc,bodyData.sign1,'dhFormfield-4162965191')
 await pdfSignature(form,pdfDoc,bodyData.sign2,'dhFormfield-4162965467')

 
const pdfBytes = await pdfDoc.save();

let attachments = [{
  filename: "filenameTest.pdf",
  content: pdfBytes,
}]


const html = `<div> <p>user ${req.user.name} has finished his job </p> </br><h1>Notes </h1></br> <p>${req.body.textArea}</p></div>`


for(const property in imageData){

  const base64EncodedImage = imageData[property]; // your base64 encoded image string
const buffer = Buffer.from(base64EncodedImage.split(',')[1], 'base64');
  attachments.push({
    filename: `${property}.jpg`,
    content: buffer
  })

}

console.log(attachments)
await sendEmail(attachments, html)

res.sendStatus(200)

//  db.query(`INSERT INTO folder (name, assigned_worker_id) VALUES (?,?)`,
//   [folderName, req.body.idUser],
//   (err, result, fields) => {})

}catch (err){
console.log(err)
}
}



const pdfSignature = async (form,pdfDoc,sign,field) => {
    const pdfLibSigImg = await pdfDoc.embedPng(sign)
const pdfLibSigImgName = 'PDF_LIB_SIG_IMG';
const sig = form.getSignature(field)

sig.acroField.getWidgets().forEach((widget) => {
    const { context } = widget.dict;
    const { width, height } = widget.getRectangle();

    const appearance = [
      ...drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        borderWidth: 1,
        //color: rgb(1, 255, 255),
        borderColor: rgb(1, 0.5, 0.75),
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
      }),

      ...drawImage(pdfLibSigImgName, {
        x: 5,
        y: 5,
        width: width - 10,
        height: height - 10,
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
      }),
    ];

    const stream = context.formXObject(appearance, {
      Resources: { XObject: { [pdfLibSigImgName]: pdfLibSigImg.ref } },
      BBox: context.obj([0, 0, width, height]),
      Matrix: context.obj([1, 0, 0, 1, 0, 0]),
    });
    const streamRef = context.register(stream);

    widget.setNormalAppearance(streamRef);
  });
}

const sendEmail = async (attachments,html) => {

  try {
const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: config.emails.sender,
    pass: config.emails.senderPwd
  }
})


  const mailOptions = {
    from: config.emails.sender,
    to: config.emails.receivers,
    subject: 'Job Done',
    html: html,
    attachments: attachments
  };


const response = await transporter.sendMail(mailOptions)

  return response
} catch (error) {
    console.log(error)
}

}


module.exports = {
    fillPDF
  };
  
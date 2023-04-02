const { PDFDocument, drawRectangle, rgb, degrees, drawImage, PDFRadioGroup } = require('pdf-lib')
const fs = require('fs/promises');
const { db } = require('../../modules/DBConnection')
const nodemailer = require('nodemailer');
const config = require("../../../config");

async function fillPDF(req, res, next) {
//console.log(req.body)
try{
const pdfData = await fs.readFile('public/LK-Fillable-3.pdf');
const pdfDoc = await PDFDocument.load(pdfData);
const fieldNames = pdfDoc.getForm().getFields().map((f)=> f.getName());
console.log({fieldNames})

 const form = pdfDoc.getForm()

 form.getTextField('196525635').setText(req.body['pdfData[field1]'])
 form.getTextField('196525636').setText(req.body['pdfData[field2]'])
 form.getTextField('196525637').setText(req.body['pdfData[filedDate1]'])
 form.getTextField('196525639').setText(req.body['pdfData[filedDate2]'])
 form.getTextField('196525638').setText(req.body['pdfData[filedDate3]'])
 form.getTextField('196525640').setText(req.body['pdfData[filedDate4]'])
 
 switch (req.body['pdfData[radioValue]']) {
  case "radio1":
    //first radio
    form.getCheckBox('radio_group_10wgzk').check(req.body['pdfData[radioValue]']);
    break;
  case "radio2":
     //second radio
      form.getCheckBox('radio_group_11hgaz').check(req.body['pdfData[radioValue]']);
    break;  
  case "radio3":
      //third radio
    form.getCheckBox('radio_group_12egcu').check(req.body['pdfData[radioValue]']);
    break;
 
  default:
    break;
 }

  
 await pdfSignature(form,pdfDoc,req.body['pdfData[sign1]'],'dhFormfield-4162965191')
 await pdfSignature(form,pdfDoc,req.body['pdfData[sign2]'],'dhFormfield-4162965467')

 
 const pdfBytes = await pdfDoc.save();

 await sendMail(pdfBytes)

//  db.query(`INSERT INTO folder (name, assigned_worker_id) VALUES (?,?)`,
//   [folderName, req.body.idUser],
//   (err, result, fields) => {})


res.sendStatus(200)

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

const sendMail = async (pdfFile) => {

  const html = `<p>user X has finished his job</p>`

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
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
    attachments:[{
      filename: "filenameTest.pdf",
      content: pdfFile,
    }]
  };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
   console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      console.log(info.accepted);
      console.log(info.rejected);     
    }
  })


}


module.exports = {
    fillPDF
  };
  
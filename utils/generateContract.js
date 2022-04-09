const fs = require('fs');
const PDFDocument = require("pdfkit-table");  
const getStream = require('get-stream')
const cloudinary = require("cloudinary");
const {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
} = require("../constants/index");
const moment = require('moment')
const { vndFormat } = require('../utils/index')
const VNnum2words = require('vn-num2words');

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
  });

exports.createContract = async (borrower,lenders,data) => {
	let doc = new PDFDocument({ margin: 50 });
  
	generateHeader(doc,data.contractCode);
	generateTable(doc, borrower);
  generateTable(doc, lenders);
  generateRule(doc,data);

	doc.end();
  try {
      const base64 = await getStream.buffer(doc)
      return await cloudinary.v2.uploader.upload(
          'data:file/pdf;base64,' + base64.toString('base64'),
          {
              folder: "pdf",
          },
      )
  } catch (error) {
      console.log(error);
  }
}


function generateHeader(doc,contractCode) {
  const day = moment().format("D")
  const month = moment().format("M")
  const year = moment().format("Y")
	doc
    .font('fonts/NotoSans-Regular.ttf')
		.fontSize(12)
		.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { align: 'center' })
		.text('Độc lập - Tự do - Hạnh phúc', { align: 'center' })
		.moveDown();

  generateLineBreaker(doc, 100, 20)
  doc
    .font('fonts/NotoSans-Regular.ttf')
		.fontSize(12)
		.text('Hợp đồng số', { align: 'center' })
    .save()

  for (let index = 0; index < contractCode.length; index++) {
    doc.rect(doc.page.width / 2 - ( 115 - 30 * index ), 140, 20, 20).stroke()
    doc.text(contractCode[index], doc.page.width / 2 - (108 - 30 * index), 141)
  }

  doc  
    .restore()
		.moveDown();

    generateLineBreaker(doc, 170, 40)

    doc
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('HỢP ĐỒNG VAY TÍN CHẤP',50,200, { align : 'center' })
    .moveDown()
    .font('fonts/NotoSans-Regular.ttf')
    .text('Căn cứ Bộ luật Dân sự số 91/2015/QH13 của nước cộng hòa xã hội chủ nghĩa Việt Nam')
    .text('Căn cứ khả năng và nhu cầu của các bên.')
    .text(`Hôm nay, ngày ${day} tháng ${month} năm ${year},`)
    .text('Chúng tôi gồm:')
		.moveDown();
   
}

function generateRule(doc,data) {
  const dayStart = moment(data.loanStartAt).format("D")
  const monthStart = moment(data.loanStartAt).format("M")
  const yearStart = moment(data.loanStartAt).format("Y")
  const dayEnd= moment(data.loanEndAt).format("D")
  const monthEnd = moment(data.loanEndAt).format("M")
  const yearEnd = moment(data.loanEndAt).format("Y")

	doc
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('Điều 1: Đối tượng của hợp đồng')
    .font('fonts/NotoSans-Regular.ttf')
		.text('Bên B đồng ý cho bên A vay số tiền:')
    .text(`Bằng số : ${vndFormat.format(data.total)}`)
    .text(`Bằng chữ : ${VNnum2words(data.total)} Việt Nam đồng`)
    .moveDown()
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('Điều 2: Thời hạn vay và phương thức vay')
    .font('fonts/NotoSans-Regular.ttf')
		.text('2.1. Thời hạn vay')
    .text(`Thời hạn vay là ${data.duration} tháng kể từ ngày ${dayStart} tháng ${monthStart} năm ${yearStart} đến ngày ${dayEnd} tháng ${monthEnd} năm ${yearEnd}.`)
    .addPage()
    .text('2.2. Phương thức vay')
    .text('Bên B cho bên A vay thông qua nền tảng Student Loan bằng hình thức chuyển khoản ngân hàng, tiền được chuyển giao đúng, đủ về số lượng và chất lượng theo 01 đợt tại thời điểm bên B kêu gọi vay thành công qua Student Loan.')
    .moveDown()
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('Điều 3: Lãi suất')
    .font('fonts/NotoSans-Regular.ttf')
    .text(`Bên A đồng ý vay số tiền quy định tại điều 1 với lãi suất ${data.interest * 100}% một tháng tính trên tổng số tiền vay, lãi suất được tính từ ngày bên A nhận tiền vay.`)
    .text('Tiền lãi được trả mỗi tháng 1 lần')
    .text('Trong thời hạn hợp đồng có hiệu lực, hai bên cam kết không thay đổi mức lãi suất cho vay đã thỏa thuận trong hợp đồng này trừ trường hợp do hai bên thỏa thuận hoặc pháp luật có quy định khác.')
		.moveDown()
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('Điều 4: Mục đích vay')
    .font('fonts/NotoSans-Regular.ttf')
    .text('Bên A cam kết sử dụng khoản tiền vay cho mục đích thanh toán học phí, không sử dụng khoản vay từ bên B vào mục đích trái quy định của pháp luật. Trường hơp bên A vi phạm cam kết nêu trên, bên A hoàn toàn chịu trách nhiệm trước pháp luật về hành vi của mình.')
    .moveDown()
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('Điều 5: Phạt vi phạm hợp đồng, trả chậm.')
    .font('fonts/NotoSans-Regular.ttf')
    .text('5.1 Phạt vi phạm hợp đồng')
    .text('Vi phạm hợp đồng được xác định khi một trong hai bên có hành vi không thực hiện hoặc thực hiện không đúng những thỏa thuận đã nêu trong hợp đồng này.')
    .text('Mức phạt được quy định bằng .... giá trị khoản vay/1 ngày, được tính từ ngày một bên có hành vi vi phạm đến thời điểm bên đó khắc phục hậu quả và thực hiện đúng hợp đồng.')
    .text('5.2 Phạt trả chậm ')
    .text('Trong quá trình thực hiện hợp đồng, trường hợp bên A chậm trả lãi, bên A sẽ phải trả một khoản tiền phạt bằng ')
    .moveDown()
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('6. Quyền và nghĩa vụ của bên A.')
    .font('fonts/NotoSans-Regular.ttf')
    .text('6.1 Quyền')
    .text('Bên A có những quyền sau:')
    .text('- Được nhận tiền vay đầy đủ và đúng hạn;')
    .text('- Được đề nghị bên A gia hạn thời gian trả lãi, nợ gốc vì những lý do bất khả kháng như thiên tai, hỏa hoạn, dịch bệnh… dẫn đến việc không trả được nợ.')
    .text('6.2 Nghĩa vụ')
    .text('Bên A có những nghĩa vụ sau:')
    .text('- Trả lãi và nợ gốc đúng hạn;')
    .text('- Cung cấp đầy đủ và chính xác thông tin cho bên B;')
    .text('- Thông báo cho bên B nếu có sự thay đổi về thông tin cá nhân, nơi cư trú, công việc….')
    .moveDown()
    .addPage()
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('7. Quyền và nghĩa vụ của bên B.')
    .font('fonts/NotoSans-Regular.ttf')
    .text('7.1 Quyền')
    .text('Bên B có những quyền sau:')
    .text('- Được cung cấp đầy đủ và trung thực thông tin cá nhân, mục đích vay, thu nhập và các thông tin khác của bên A;')
    .text('- Được bên A thanh toán đủ và đúng hạn lãi, tiền gốc, tiền phạt vi phạm hợp đồng, và phạt trả chậm (nếu có).')
    .text('7.2 Nghĩa vụ')
    .text('Bên B có nghĩa vụ sau:')
    .text('- Chuyển giao tài sản cho vay đầy đủ, đúng hạn;')
    .text('- Giữ bí mật những thông tin do bên A cung cấp.')
    .moveDown()
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('Điều 8: Những cam kết chung')
    .font('fonts/NotoSans-Regular.ttf')
    .text('Hai bên giao kết hợp đồng này trên tinh thần trung thực, thiện chí, tự nguyện và hiểu rõ nội dung hợp đồng. Mọi thỏa thuận khác trong quá trình thực hiện hợp đồng được hai bên lập thành văn bản và có giá trị pháp lý như một phụ lục không thể tách rời của hợp đồng này.')
    .text('Hai bên cam kết tôn trọng và thực hiện đúng những nội dung đã thỏa thuận trong hợp đồng và theo quy định của pháp luật, trường hợp có xảy ra tranh chấp, các bên ưu tiên giải quyết bằng con đường hoà giải, thương lượng.')
    .text('Một trong hai bên có quyền khởi kiện tại tòa án nhân dân cấp có thẩm quyền để giải quyết tranh chấp phát sinh trong quá trình thực hiện hợp đồng nếu việc hòa giải, thương lượng không thành.')
    .moveDown()
    .font('fonts/NotoSans-Bold.ttf')
		.fontSize(12)
		.text('Điều 9: Hiệu lực của hợp đồng')
    .font('fonts/NotoSans-Regular.ttf')
    .text('Hợp đồng vay tài sản này được lưu giữ tại nền tảng Student Loan, hai bên có thể xem thông qua ứng dụng, có hiệu lực kể từ thời điểm bên A kêu gọi vay thành công.')
    .moveDown();

}

function generateLineBreaker(doc, y, width) {
  doc   
    .save()                   
    .moveTo(doc.page.width / 2 - width, y)
    .lineTo(doc.page.width / 2 + width, y)
    .fill('#000')
    .moveDown();   
}
function generateTable(doc, table) {
  doc.table(table,{
    columnsSize: [ 250, doc.page.width - 350, 0 ],
    prepareHeader: () => doc.font('fonts/NotoSans-Bold.ttf').fontSize(12),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font('fonts/NotoSans-Regular.ttf').fontSize(10);
    },
  })
}

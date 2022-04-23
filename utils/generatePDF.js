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

exports.createPDF = async (data) => {
    const loan = data.loan
    const student = data.student
    const tutorlist = data.tutorlist
    let doc = new PDFDocument({ margin: 30 });

    generatePart1(doc, student);
    generatePart2(doc, loan);
    generateTable(doc, tutorlist)
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


function generatePart1(doc, student) {
    const tempAddress = student.User.address
    const address = tempAddress.replace(/-/g, ", ");
    doc
        .font('fonts/NotoSans-Regular.ttf')
        .fontSize(12)
        .text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { align: 'center' })
        .text('Độc lập - Tự do - Hạnh phúc', { align: 'center' })

    generateLineBreaker(doc, 100, 20)
    doc
        .font('fonts/NotoSans-Regular.ttf')
        .fontSize(14)
        .text('THÔNG TIN HỒ SƠ', { align: 'center' })
        .moveDown()

    doc
        .font('fonts/NotoSans-Regular.ttf')
        .fontSize(12)
        .text('PHẦN I: THÔNG TIN CƠ BẢN')
        .moveDown()

    doc
        .font('fonts/NotoSans-Regular.ttf')
        .fontSize(12)
        .text(`Họ và tên: ${student.User.firstName} ${student.User.lastName}`)
        .text(`Ngày tháng năm sinh: ${moment(student.User.birthDate).format("DD/MM/YYYY")}`)
        .text(`Số CMNND: ${student.citizenId}, Cấp tại: ${student.citizenCardCreatedPlace}, Vào ngày: ${moment(student.citizenCardCreatedDate).format("DD/MM/YYYY")}`)
        .text(`Địa chỉ hiện tại: ${address}`)
        .text(`Học tại trường: ${student.SchoolMajor.School.name}`)
        .text(`Chuyên ngành: ${student.SchoolMajor.Major.name}`)
        .text(`MSSV: ${student.studentCardId}`)
        .moveDown()
}

function generatePart2(doc, loan) {

    const totalMoney = Number.parseFloat(loan.totalMoney)
        + (Number.parseFloat(loan.totalMoney) * Number.parseFloat(loan.interest) * Number.parseInt(loan.duration))
    const leftMoney = totalMoney - (loan.expectedGraduationTime * Number.parseInt(loan.fixedMoney));
    const moneyPaidGraduted = Math.round(leftMoney / (loan.duration - loan.expectedGraduationTime))

    doc
        .font('fonts/NotoSans-Regular.ttf')
        .fontSize(12)
        .text('PHẦN II: THÔNG TIN HỒ SƠ VAY')
        .moveDown()

    doc
        .font('fonts/NotoSans-Regular.ttf')
        .fontSize(12)
        .text('Số tiền cần vay:')
        .text(`Bằng số: ${vndFormat.format(loan.totalMoney)}`)
        .text(`Bằng chữ: ${VNnum2words(loan.totalMoney)}đồng`)
        .text(`Với lãi suất ${Number.parseFloat(loan.interest) * 100}%`)
        .text(`Và với lãi suất quá hạn: ${Number.parseFloat(loan.penaltyFee) * 100}% số dư nợ phải trả`)
        .text(`Thời hạn vay là ${loan.duration} tháng`)
        .text(`Với mức tiền cần trả mỗi tháng khi còn đi học:`)
        .text(`Bằng số: ${vndFormat.format(loan.fixedMoney)}`)
        .text(`Bằng chữ: ${VNnum2words(loan.fixedMoney)}đồng`)
        .text(`Khi học sinh đã ra trường phần tiền phải trả trên mỗi tháng: `)
        .text(`Bằng số: ${vndFormat.format(moneyPaidGraduted)}`)
        .text(`Bằng chữ: ${VNnum2words(moneyPaidGraduted)} đồng`)
        .moveDown()

    doc
        .addPage()
        .font('fonts/NotoSans-Regular.ttf')
        .fontSize(12)
        .text('PHẦN III: THÔNG TIN NGƯỜI GIÁM HỘ')
        .moveDown()
}

function generateLineBreaker(doc, y, width) {
    doc
        .save()
        .moveTo(doc.page.width / 2 - width, y)
        .lineTo(doc.page.width / 2 + width, y)
        .fill('#000')
        .moveDown();
}

function generateTable(doc, tutorlist) {
    tutorlist.map(item => {
        doc
            .font('fonts/NotoSans-Regular.ttf')
            .fontSize(12)
            .text(`Họ và tên: ${item.name} là ${item.relation} của học sinh`)
            .table({
                headers: ["", ""],
                // headers: [`Họ và tên: ${item.name} Là ${item.relation} của học sinh`, ""],
                rows: [
                    [`Email: ${item.email}`, `Số ĐT: ${item.phone}`],
                    [`Ngày sinh: ${moment(item.birthday).format("DD/MM/YYYY")}`, `Địa chỉ: ${item.address.replace(/-/g, ", ")}`],
                    [`Số CMND: ${item.citizenId}`, `Cấp tại: ${item.citizenCardCreatedPlace} vào ngày: ${moment(item.citizenCardCreatedDate).format("DD/MM/YYYY")}`],
                    // [`Mặt trước CMND:`, `Mặt sau CMND:`],
                    // [`${item.frontCitizenCardImageUrl}`, `${item.backCitizenCardImageUrl}`],
                ],
            }, {
                columnsSize: [250, doc.page.width - 350, 0],
                prepareHeader: () => doc.font('fonts/NotoSans-Bold.ttf').fontSize(12),
                prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                    doc.font('fonts/NotoSans-Regular.ttf').fontSize(10);
                },
            })
    })
}

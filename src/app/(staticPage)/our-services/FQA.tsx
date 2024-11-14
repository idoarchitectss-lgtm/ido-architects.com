import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const qaa = [
    {
        q: "Công ty cung cấp những dịch vụ thiết kế nào?",
        a:"Chúng tôi cung cấp các dịch vụ thiết kế kiến trúc đa dạng, từ thiết kế bản vẽ 2D, 3D chi tiết đến thiết kế thi công trọn gói, đảm bảo đáp ứng mọi nhu cầu của khách hàng. "
    },
    {
        q: "Thiết kế 3D là gì và có vai trò gì trong quá trình thiết kế?",
        a:"Thiết kế 3D là việc tạo ra mô hình 3 chiều của công trình, giúp khách hàng hình dung rõ ràng không gian sống tương lai. Mô hình 3D giúp khách hàng dễ dàng hình dung không gian, màu sắc, vật liệu và các chi tiết thiết kế khác trước khi đưa vào thi công. "
    },
    {
        q: "Thiết kế thi công trọn gói có những gì?",
        a:"Dịch vụ thiết kế thi công trọn gói bao gồm toàn bộ quá trình từ khâu lên ý tưởng, thiết kế bản vẽ, lựa chọn vật liệu, thi công và hoàn thiện công trình. Chúng tôi sẽ đồng hành cùng khách hàng từ đầu đến cuối dự án. "
    },
    {
        q: "Chi phí thiết kế phụ thuộc vào những yếu tố nào?",
        a:"Chi phí thiết kế phụ thuộc vào nhiều yếu tố như: diện tích xây dựng, độ phức tạp của công trình, số lượng bản vẽ, vật liệu sử dụng và các yêu cầu đặc biệt của khách hàng.Để có báo giá chính xác nhất, quý khách vui lòng liên hệ với chúng tôi để được tư vấn."
    },
    {
        q: "Phương thức thanh toán như thế nào?",
        a:"Chúng tôi linh hoạt trong việc lựa chọn phương thức thanh toán, có thể thanh toán bằng tiền mặt, chuyển khoản hoặc theo tiến độ thi công. Quý khách có thể lựa chọn phương thức phù hợp nhất."
    },
    {
        q: "Quy trình làm việc của một dự án thiết kế diễn ra như thế nào?",
        a:"Tiếp nhận thông tin và yêu cầu của khách hàng.Khảo sát hiện trạng và tư vấn giải pháp.Lên ý tưởng thiết kế và trình bày cho khách hàng.Hoàn thiện bản vẽ thiết kế.Bàn giao bản vẽ và tiến hành thi công (nếu có)."
    },
]

const FQAComponent = () => {
    return (
            <Accordion type="single" collapsible
            className="w-10/12 md:w-6/12 mx-auto"
            >
                {
                    qaa.map((question,index)=> (
                <AccordionItem 
                key={index}
                value={question.q}>
                    <AccordionTrigger>{question.q}</AccordionTrigger>
                    <AccordionContent>
                       {question.a}
                    </AccordionContent>
                </AccordionItem>

                    ))
                }
                

            </Accordion>
    )
}
export default FQAComponent;


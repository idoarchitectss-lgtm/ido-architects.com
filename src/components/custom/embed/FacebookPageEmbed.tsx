import { useEffect } from "react";


interface window {
    FB:any
}
const FacebookPageEmbed = () => {
  useEffect(() => {
    // Kiểm tra nếu SDK chưa được tải
    if (!(window as any).FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        (window as any).FB.init({
          xfbml: true,
          version: "v16.0", // Thay bằng phiên bản SDK hiện tại
        });
      };
      document.body.appendChild(script);
    } else {
      // Nếu SDK đã tải, khởi tạo lại các thẻ xfbml
      (window as any).FB.XFBML.parse();
    }
  }, []);

  return (
    <div className="w-full">
      {/* Thay URL của trang Facebook bằng URL của bạn */}
      <div
        className="fb-page w-full"
        data-href="https://www.facebook.com/ido.architectss"
        data-tabs="timeline" // Các tab: timeline, events, messages
        data-width="300"
        data-height="200"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
      </div>
    </div>
  );
};

export default FacebookPageEmbed;

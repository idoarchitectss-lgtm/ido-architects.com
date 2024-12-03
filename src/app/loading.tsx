import Image from "next/image";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='fixed h-[100vh] w-[100vw] inset-0 flex flex-col items-center justify-center gap-5 bg-white z-50
    '>
      <p className="text-7xl font-bold text-secondary">
          IDO
        </p>
      <p className="text-4xl font-bold text-primary">
        ARCHITECT
      </p>
      <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="0 0 24 24"><circle cx={12} cy={2} r={0} fill="#d44d04"><animate attributeName="r" begin={0} calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.087s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.175s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.262s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.35s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.438s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.525s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.612s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle></svg>

          {/* <svg fill="#F6821F" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_2_"> <path id="XMLID_4_" d="M75,0H15C6.716,0,0,6.716,0,15v60c0,8.284,6.716,15,15,15h60c8.284,0,15-6.716,15-15V15 C90,6.716,83.284,0,75,0z"></path> <path id="XMLID_6_" d="M75,120H15c-8.284,0-15,6.716-15,15v60c0,8.284,6.716,15,15,15h60c8.284,0,15-6.716,15-15v-60 C90,126.716,83.284,120,75,120z"></path> <path id="XMLID_8_" d="M195,0h-60c-8.284,0-15,6.716-15,15v60c0,8.284,6.716,15,15,15h60c8.284,0,15-6.716,15-15V15 C210,6.716,203.284,0,195,0z"></path> <path id="XMLID_10_" d="M195,120h-60c-8.284,0-15,6.716-15,15v60c0,8.284,6.716,15,15,15h60c8.284,0,15-6.716,15-15v-60 C210,126.716,203.284,120,195,120z"></path> </g> </g></svg> */}
      </div>
    </div>
  )
}
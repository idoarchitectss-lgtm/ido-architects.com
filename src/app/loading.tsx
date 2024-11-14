import Image from "next/image";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='fixed h-[100vh] w-[100vw] inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700 to-primary
    '>
      <p className="text-7xl font-bold text-secondary">
          IDO
        </p>
      <p className="text-4xl font-bold text-white">
        
        ARCHITECT
      </p>
      <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="0 0 24 24"><circle cx={12} cy={2} r={0} fill="#d44d04"><animate attributeName="r" begin={0} calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.087s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.175s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.262s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.35s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.438s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.525s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle><circle cx={12} cy={2} r={0} fill="#d44d04" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.612s" calcMode="spline" dur="0.7s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate></circle></svg>
      </div>
    </div>
  )
}
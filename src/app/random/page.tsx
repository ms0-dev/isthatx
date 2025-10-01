import Image from "next/image";
import Link from "next/link";

const galleryImages = [
  { src: "https://pbs.twimg.com/profile_images/1616614464169840641/uQgxVHsf_400x400.jpg", alt: "jamwt" },
  { src: "https://pbs.twimg.com/profile_images/1965975070750150657/BPSWoshv_400x400.jpg", alt: "rasmickyy" },
  { src: "https://pbs.twimg.com/profile_images/1951519225123840002/RF_QFrOA_400x400.jpg", alt: "waynesutton" },
  { src: "https://pbs.twimg.com/profile_images/1818135231016091648/ARAbNLX9_400x400.jpg", alt: "erquhart_" },
  { src: "https://pbs.twimg.com/profile_images/1219707721014030336/ZscKloBb_400x400.jpg", alt: "nicolapps" },
  { src: "https://pbs.twimg.com/profile_images/1536667914912374785/hMf2JM7j_400x400.jpg", alt: "TheMoustafa_" },
  { src: "https://pbs.twimg.com/profile_images/1674655249682841607/zHAPiC1Q_400x400.jpg", alt: "imbereket" },
  { src: "https://pbs.twimg.com/profile_images/1844531055484604436/tFKVKb8v_400x400.jpg", alt: "cpenned" },
  { src: "https://pbs.twimg.com/profile_images/1963914195801407488/SCIlpe1M_400x400.jpg", alt: "mo_geryy" },
  { src: "https://pbs.twimg.com/profile_images/1949308286081380352/RjuYxb69_400x400.jpg", alt: "dan_goosewin" },
  //{ src: "", alt: "no account?" },
  { src: "https://pbs.twimg.com/profile_images/1922698589798891520/o6Wp8RR6_400x400.jpg", alt: "omarmcadam" },
  { src: "https://pbs.twimg.com/profile_images/1811534400779386880/Wv-VrQIy_400x400.jpg", alt: "GauravV80069026" },
  { src: "https://pbs.twimg.com/profile_images/676677785507618816/05e773gb_400x400.jpg", alt: "dariusemrani" },
];

export default function Page() {
  return (
    <div className="pt-24 mx-auto max-w-6xl px-6 lg:px-12 h-[100vh]">
      <div className="text-2xl font-bold text-center m-6">Find profiles to chat with</div>
      <div className="flex gap-4 flex-wrap justify-center">
        {galleryImages.map((image) => (
          <Link href={`/chat/${image.alt}`} key={image.alt} className="relative overflow-hidden rounded-lg  aspect-square p-0.5 w-64 h-64 bg-muted">
            <Image src={image.src} alt={image.alt} width={100} height={100} className="w-full h-full object-cover object-top rounded-full m-10" />
            <p className="absolute top-2 left-2 bg-white/80 rounded px-1 text-black">isthat</p>
            <p className="absolute bottom-2 right-2 max-w-[100px] text-ellipsis overflow-hidden text-xs bg-white/80 rounded px-1 text-black">
              @{image.alt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

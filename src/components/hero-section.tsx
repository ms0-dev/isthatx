import ImageGallery from "@/components/profile-gallery";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { type: "spring", bounce: 0.3, duration: 1.5 } },
  },
};

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

/*const loveBoard = [
  { name: "Convex", image: "convex.svg" },
  { name: "OpenAI", image: "openai.svg" },
  { name: "Firecrawl", image: "firecrawl.svg" },
  { name: "VAPI", image: "vapi.svg" },
  { name: "Better Auth", image: "better-auth.svg" },
  { name: "Autumn", image: "autumn.svg" },
  { name: "Resend", image: "resend.svg" },
  { name: "Inkeep", image: "inkeep.svg" },
  { name: "Scorecard", image: "scorecard.svg" },
];*/

export default function HeroSection() {
  return (
    <main className="overflow-hidden">
      <div aria-hidden className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>
      <section>
        <div className="relative pt-24">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
          />

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup
                // @ts-expect-error transition variants
                variants={{ container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } }, ...transitionVariants }}
                className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
              >
                <div className="min-h-screen_ h-[700px] flex justify-center items-center w-full rounded-lg overflow-hidden relative">
                  <ImageGallery initialImages={galleryImages} />
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5 absolute top-1/2 transform -translate-y-1/2"
                  >
                    <Button asChild size="lg" className="rounded-xl px-5 text-base">
                      <Link href="/login">
                        <span className="text-nowrap">Find out now</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link href="/" className="block text-sm duration-150 hover:opacity-75">
                <span>❤️❤️❤️</span>
              </Link>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
              {loveBoard.map((item, index) => (
                <div key={index} className="flex">
                  <Image className="mx-auto h-7 w-fit dark:invert saturate-0" src={item.image} alt={item.name} height={100} width={100} />
                </div>
              ))}
            </div>
          </div>
        </section> */}
    </main>
  );
}

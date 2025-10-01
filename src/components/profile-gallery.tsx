"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(Draggable, MotionPathPlugin, InertiaPlugin);

interface ImageGalleryProps {
  initialImages: {
    src: string;
    alt: string;
  }[];
  className?: string;
  imageQuality?: number;
  circleSize?: number;
}

const ImageGallery = ({ initialImages, className, imageQuality = 400, circleSize = 400 }: ImageGalleryProps) => {
  const [images, setImages] = useState(initialImages.slice(0, 6));
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const circlePathRef = useRef<SVGPathElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  imageRefs.current = images.map((_, i) => imageRefs.current[i] || null);
  const imageSize = 100 / images.length;
  const isPressedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPressedRef.current) return;
      setImages([...initialImages].sort(() => Math.random() - 0.5).slice(0, 6));
    }, 5000);

    return () => clearInterval(interval);
  }, [initialImages]);

  useEffect(() => {
    if (imageRefs.current.length === 0) return;

    gsap.fromTo(
      imageRefs.current.filter(Boolean),
      { scale: 1 }, // initial state
      { scale: 1.2, duration: 0.4, ease: "power2.out", yoyo: true, repeat: 1 }, // animation
    );
  }, [images]);

  useGSAP(
    () => {
      if (!circlePathRef.current || !containerRef.current) return;

      const imageElements = imageRefs.current.filter(Boolean);
      const container = containerRef.current;

      gsap.set(imageElements, {
        motionPath: {
          path: circlePathRef.current,
          align: circlePathRef.current,
          alignOrigin: [0.5, 0.5],
          end: (i) => i / imageElements.length,
          autoRotate: true,
        },
      });

      Draggable.create(container, {
        type: "rotation",
        inertia: true,
        onPress: function () {
          isPressedRef.current = true;
          // Kill any wheel animations when starting to drag
          if (isWheeling) {
            gsap.killTweensOf(container);
          }
        },
        onRelease: function (this: Draggable) {
          isPressedRef.current = false;
          if (this.tween) {
            this.tween.eventCallback("onComplete", () => {
              startAutoScroll();
            });
          } else {
            startAutoScroll();
          }
        },
      });
      startAutoScroll();

      function startAutoScroll() {
        gsap.to(container, {
          rotation: "+=360",
          duration: 30,
          ease: "none",
          repeat: -1,
        });
      }

      let isHovered = false;
      let isWheeling = false;

      const handleWheel = (event: WheelEvent) => {
        if (!isHovered) return;
        event.preventDefault();
        event.stopPropagation();

        // Set wheeling flag and kill any existing animations
        isWheeling = true;
        gsap.killTweensOf(container);

        const currentRotation = gsap.getProperty(container, "rotation") as number;
        const newRotation = currentRotation + event.deltaY * 0.5;

        // Apply smooth rotation with gsap.to
        gsap.to(container, {
          rotation: newRotation,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });

        // Reset wheeling flag after animation
        setTimeout(() => {
          isWheeling = false;
        }, 300);
      };

      const handleMouseEnter = () => {
        isHovered = true;
      };

      const handleMouseLeave = () => {
        isHovered = false;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    {
      scope: containerRef,
      dependencies: [images.length],
    },
  );

  return (
    <div className={`w-full h-full flex justify-center items-center overflow-hidden ${className || ""}`}>
      <div ref={containerRef} className="relative w-full h-full max-w-full max-h-full aspect-square flex justify-center items-center">
        <svg ref={svgRef} viewBox={`0 0 ${circleSize} ${circleSize}`} className="w-[80%] h-[80%] opacity-0">
          <path
            ref={circlePathRef}
            id="circle"
            fill="none"
            stroke="black"
            strokeWidth="1"
            d="M396,200 C396,308.24781 308.24781,396 200,396 91.75219,396 4,308.24781 4,200 4,91.75219 91.75219,4 200,4 308.24781,4 396,91.75219 396,200 z"
          />
        </svg>

        {images.map((image, index) => (
          <div
            key={index}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            className="absolute overflow-hidden rounded-lg shadow-lg aspect-square p-0.5 dark:bg-muted"
            style={{
              width: `${imageSize}%`,
              height: `${imageSize}%`,
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={imageQuality}
              height={imageQuality}
              priority={index === 0}
              className="w-full h-full object-cover object-top rounded-lg"
            />
            <p className="absolute top-2 left-2 bg-white/80 rounded px-1 text-black">isthat</p>
            <p className="absolute bottom-2 right-2 max-w-[100px] text-ellipsis overflow-hidden text-xs bg-white/80 rounded px-1 text-black">
              @{image.alt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

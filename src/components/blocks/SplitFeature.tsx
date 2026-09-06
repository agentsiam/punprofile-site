import Image from "next/image";

/**
 * B2: a picture one side, the argument the other, vertically centred.
 *
 * The reference alternates the side down a page, which is why `reverse` exists
 * and why it is a prop rather than two components. Below `large` the picture
 * always follows the words: on a phone the argument comes first and the
 * illustration is support, never the thing that pushes the button under the
 * fold.
 *
 * The image is `object-cover` in a 4:3 box so a row of these crops the same way
 * whatever the source ratio, which is the rule the card rows already follow.
 *
 * **`media` was added 06/09/2026 and takes the same box.** The product pages
 * draw their figure rather than loading one, because every picture in `public/`
 * already belongs to another surface; see `ProductDiagram.tsx`. A drawing and a
 * photograph are the same thing to this component, which is a 4:3 box on the
 * side the layout asks for, so the alternative is passed in rather than the
 * component growing a second layout for it. Exactly one of `src` and `media` is
 * given, and the type says so rather than the component checking at runtime.
 */

type Frame =
  | { src: string; alt: string; media?: never }
  | { media: React.ReactNode; src?: never; alt?: never };

export default function SplitFeature({
  reverse = false,
  children,
  ...frame
}: Frame & {
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-10 large:grid-cols-2 large:gap-16">
      <div className={reverse ? "large:order-2" : undefined}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          {frame.media ?? (
            <Image
              src={frame.src as string}
              alt={frame.alt as string}
              fill
              sizes="(max-width: 1200px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>
      </div>
      <div className={reverse ? "large:order-1" : undefined}>{children}</div>
    </div>
  );
}

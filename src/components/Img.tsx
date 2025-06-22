export default function Img({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={"./assets/" + src}
      {...(alt ? { alt } : {})}
      className={className}
    />
  );
}

import { IconCheck, IconDeviceTv } from "@tabler/icons-react";

function AnimatedTvIcon() {
  return (
    <div className="relative hover-shake group">
      <IconDeviceTv className="size-12" />
      <IconCheck
        color="var(--color-primary)"
        className="size-5 absolute inset-0 m-auto opacity-0 translate-y-0.5 transition-opacity duration-200 group-hover:opacity-100"
      />
    </div>
  );
}

export default AnimatedTvIcon;

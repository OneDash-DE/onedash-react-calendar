import React from "react";

export interface MediaRenderProps {
	size?: number;
	type: "mobile" | "desktop";
	children: JSX.Element | JSX.Element[];
}

const MediaRender = (props: MediaRenderProps) => {
	const size = props.size ?? 720;
	const { type } = props;
	const checkRender = () => (type === "mobile" ? window.innerWidth < size : window.innerWidth > size);

	const [shouldRender, updateRender] = React.useState(checkRender());

	React.useEffect(() => {
		window.addEventListener("resize", () => updateRender(checkRender()));
	});

	return <>{shouldRender && props.children}</>;
};

export default MediaRender;

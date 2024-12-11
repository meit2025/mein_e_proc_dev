import React from "react";
import PropTypes from "prop-types";

const SVGLoader = ({ src = "", width = "24px", height = "24px", className = "", alt = "" }) => {
    if (!src) {
        console.error("SVGLoader: 'src' is required.");
        return null;
    }

    return (
        <img
            src={src}
            width={width}
            height={height}
            className={className}
            alt={alt || "SVG icon"}
        />
    );
};

SVGLoader.propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    alt: PropTypes.string,
};

export default SVGLoader;

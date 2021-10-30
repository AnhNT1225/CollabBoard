import React from "react";

export const ContextProviderComposer = ({ contextProviders, children }) => {
	return contextProviders.reduceRight(
		(children, parent, index) => React.cloneElement(parent, { children }),
		children
	);
};

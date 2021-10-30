import React from "react";
import "./styles.scss";
const PageFooter = () => {
	return (
		<footer className="footer">
			<div className="footer_wrap">
				<p>© 2021 Copyright by Collab Board</p>
				<div className="footer_media">
					<ul>
						<li>
							<a href="https://www.facebook.com/">
								<i className="fab fa-facebook-f"></i>
							</a>
						</li>
						<li>
							<a href="https://twitter.com/">
								<i className="fab fa-twitter"></i>
							</a>
						</li>
						<li>
							<a href="https://www.youtube.com/">
								<i className="fab fa-youtube"></i>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	);
};

export default PageFooter;

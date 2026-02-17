import Script from "next/script";
import Head from "next/head";

const config = require('../next.config');

export default function Layout({children}) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>How you doin'?</title>
                <link rel="icon" type="image/x-icon" href={config.basePath + "/favicon.ico"} />
            </Head>

            {children}

            <Script src={config.basePath + "/js/jquery-3.2.1.min.js"} strategy="beforeInteractive" />
            <Script src={config.basePath + "/js/popper.js"} strategy="beforeInteractive" />
            <Script src={config.basePath + "/js/bootstrap.min.js"} strategy="beforeInteractive" />
            <Script src={config.basePath + "/js/moment.min.js"} strategy="beforeInteractive" />
            <Script src={config.basePath + "/js/slick.min.js"} strategy="beforeInteractive" />
            <Script src={config.basePath + "/js/slick-custom.js"} strategy="beforeInteractive" />
            <Script src={config.basePath + "/js/parallax100.js"} strategy="beforeInteractive" />
            {/* <script type="text/javascript">
                $('.parallax100').parallax100();
            </script> */}
            <Script src={config.basePath + "/js/countdowntime.js"} strategy="beforeInteractive" />
            <Script src={config.basePath + "/js/main.js"} />
        </>
    );
}
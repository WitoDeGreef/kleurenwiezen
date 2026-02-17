import Link from "next/link";

const config = require('../next.config');

export default function Card({url, size, image, name}) {
    const basePath = config.basePath;
    
    return (
        <Link href={url}>
            <div className="item-ourmenu bo-rad-10 hov-img-zoom pos-relative m-t-30">
                <img src={basePath + "/images/" + image} alt="IMG-MENU" />

                <div className={"btn2 flex-c-m txt5 ab-c-m " + size}>
                    {name}
                </div>
            </div>
        </Link>
    );
}
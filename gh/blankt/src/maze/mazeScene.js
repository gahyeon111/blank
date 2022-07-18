import { useEffect } from "react";

function Input() {
    useEffect(() => {
        var script = document.createElement("script");
        script.src = "Box2dWeb.min.js";
        script.async = true;
        document.body.appendChild(script);
        script.src = "Three.js";
        script.async = true;
        document.body.appendChild(script);
        script.src = "keyboard.js";
        script.async = true;
        document.body.appendChild(script);
        script.src = "jquery.js";
        script.async = true;
        document.body.appendChild(script);
        script.src = "maze.js";
        script.async = true;
        document.body.appendChild(script);
        script.src = "index.js";
        script.async = true;
        document.body.appendChild(script);
    });
}

function Scene() {
    return <Input />;
}

export default Scene
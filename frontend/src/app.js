import "./styles/styles.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import {Router} from "./router";

class App {
    constructor() {
        new Router();
    }
}

(new App());
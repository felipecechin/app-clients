import {BrowserRouter, Route, Switch} from "react-router-dom";
import ClientForm from "./components/ClientForm";
import ClientTable from "./components/ClientTable";

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route component={ClientForm} path="/" exact/>
            <Route component={ClientTable} path="/listar" exact/>
        </Switch>
    </BrowserRouter>
);

export default Routes;

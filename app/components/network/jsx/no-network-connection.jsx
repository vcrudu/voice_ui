/**
 * Created by Victor on 4/29/2016.
 */

(function() {
    "use strict";

    var Layout = ReactMDL.Layout;
    var Content = ReactMDL.Content;
    var Card = ReactMDL.Card;
    var CardTitle  = ReactMDL.CardTitle;
    var CardText  = ReactMDL.CardText;
    var CardMenu   = ReactMDL.CardMenu;
    var CardActions   = ReactMDL.CardActions;
    var Button   = ReactMDL.Button;

    var NoNetworkConnection = React.createClass({
        handleExitClick: function() {
            Bridge.Redirect.exitFromApplication();
        },
        render: function() {
            var component = this;
            return <Layout>
                <Content>
                    <div className="page-content-wrapper">
                        <Card className="message-card-wide mdl-shadow--2dp">
                            <CardTitle>
                                <h6 className="mdl-card__title-text">No Internet Connection</h6>
                            </CardTitle>
                            <CardText>
                                Sorry, no Internet connectivity detected. Please reconnect.
                            </CardText>
                            <CardMenu>
                                <CardActions>
                                    <Button onClick={this.handleExitClick} className="mdl-button--accent exit-from-application-button" colored>EXIT FROM APPLICATION</Button>
                                </CardActions>
                            </CardMenu>
                        </Card>
                    </div>
                </Content>
            </Layout>
        }
    });

    ReactDOM.render(<NoNetworkConnection />, document.getElementById("no-internet-connection"));
})();

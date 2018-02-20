/**
 * Created by Victor on 4/8/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var ProviderSignUpBackButton = React.createClass({
        handleBackButton: function() {
            Bridge.Redirect.redirectToWithLevelsUp("landing/provider-landing.html", 2);
        },
        render: function() {
            return <div>
                <a href="javascript:void(0);" className="btn-back" title="Back" onClick={this.handleBackButton}>
                    <i className="material-icons md-48 md-inactive">keyboard_backspace</i>
                </a>
                <h2 className="page-title">Sign Up</h2>
            </div>
        }
    });

    ReactDOM.render(<ProviderSignUpBackButton />, document.getElementById("back-button-container"));
})();
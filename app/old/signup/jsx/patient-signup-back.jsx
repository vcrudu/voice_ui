/**
 * Created by Victor on 3/31/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var PatientSignUpButton = React.createClass({
        handleBackButton: function() {
            Bridge.Redirect.redirectToWithLevelsUp("landing/landing.html", 2);
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

    ReactDOM.render(<PatientSignUpButton />, document.getElementById("back-button-container"));
})();
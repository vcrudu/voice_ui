/**
 * Created by Victor on 9/8/2016.
 */

(function() {

    "use strict";

    var Layout = ReactMDL.Layout;
    var Content = ReactMDL.Content;
    var Checkbox  = ReactMDL.Checkbox;
    var RadioGroup   = ReactMDL.RadioGroup;
    var Radio  = ReactMDL.Radio;
    var Button  = ReactMDL.Button;
    var Card  = ReactMDL.Card;
    var CardTitle  = ReactMDL.CardTitle;
    var CardText  = ReactMDL.CardText;
    var ProgressBar  = ReactMDL.ProgressBar;
    var List  = ReactMDL.List;
    var ListItem  = ReactMDL.ListItem;

    var ChoiceButton = React.createClass({
        handleClick: function() {
            this.props.onClicked(this.props.id);
        },
        render: function() {
            return <Button key={this.props.question.id + "_" + this.props.id + "_button"} ripple onClick={this.handleClick} className="accent-color">{this.props.label}</Button>
        }
    });

    var SymptomateExplain = React.createClass({
        getInitialState: function() {
            return {
                conditionProbability
            }
        },
        componentDidMount: function() {
        },
        render: function() {
            return <Layout>
                <ProgressBar indeterminate ref="progressBar" id="progressBar" className="mdl-progress-top"/>
                <Content>
                    <div className="page-content">
                       Symptomate Explain.
                    </div>
                </Content>
            </Layout>
        }
    });

    ReactDOM.render(<SymptomateExplain />, document.getElementById("symptomate-explain"));
})();
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';

import { Button, ButtonIcon } from 'rmwc/Button';
import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardAction,
    CardActions,
    CardActionButtons,
    CardActionIcons
  } from 'rmwc/Card';

import { LinearProgress } from 'rmwc/LinearProgress';
import { Radio } from 'rmwc/Radio';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryText,
    ListItemGraphic,
    ListItemMeta,
    ListDivider
} from 'rmwc/List';

import { Grid, GridCell } from 'rmwc/Grid';
import { Checkbox } from 'rmwc/Checkbox';
import { Typography } from 'rmwc/Typography';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
  } from 'rmwc/Dialog';

import { Fab } from 'rmwc/Fab';
import Picker from 'react-mobile-picker-scroll';
  

import symptomateService from '../../model/SymptomateService';
import moment from 'moment';

const numberOfPosts = 10;

class ChoiceButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.onClicked(this.props.id);
    }
    render() {
        return <Button key={this.props.question.id + "_" + this.props.id + "_button"} onClick={this.handleClick}>{this.props.label}</Button>
    }
}

const SupportingEvidence = (props) => (
    props.supporting_evidence && props.supporting_evidence.length > 0?
        (<div>
            <Typography use="subheading2" tag="h3">The condition is based of these symptoms:</Typography>
            <List>
                {
                    props.supporting_evidence.map((sEvidence) => {
                        var random = Math.random();
                        return <ListItemSecondaryText key={random}>{sEvidence.name}</ListItemSecondaryText>
                    })
                }
            </List>
        </div>) : null);

const ConflictingEvidence = (props) => (
    props.conflicting_evidence && props.conflicting_evidence.length > 0?
        (<div>
            <Typography use="subheading2" tag="h3">Missing symptoms that could increase probability of this condition:</Typography>
            <List>
                {
                    props.conflicting_evidence.map((cEvidence) => {
                        var random = Math.random();
                        return <ListItemSecondaryText key={random}>{cEvidence.name}</ListItemSecondaryText>;
                    })
                }
            </List>
        </div>) : null);

const ExplainContainer = (props) => (
    props.show ?
        (<div style={{marginTop:"10px"}}>
            <SupportingEvidence supporting_evidence={props.supporting_evidence} />
            <ConflictingEvidence conflicting_evidence={props.conflicting_evidence} />
        </div>) : null);

class ConditionResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            explanation: {
                supporting_evidence: [],
                conflicting_evidence: []
            },
            explainContainerShow: false
        };

        this.handleConditionClick = this.handleConditionClick.bind(this);
    }

    handleConditionClick() {
        if (!this.state.explanation.supporting_evidence || this.state.explanation.supporting_evidence.length === 0) {

            var evidenceArray = [];
            this.props.diagnosticPost.evidence.map((evidence) => {
                evidenceArray.push({ id: evidence.id, choice_id: evidence.choice_id });
            });

            var obj = {
                target: this.props.targetId,
                evidence: evidenceArray,
                sex: this.props.diagnosticPost.sex,
                age: this.props.diagnosticPost.age
            };

            symptomateService.explainDiagnosis(obj, (error, explanationResult) => {
                if (explanationResult.success) {
                    this.setState({ explanation: explanationResult.data });
                    this.setState({ explainContainerShow: true });
                } else {
                    this.props.openExplainNotRelevantDialog();
                }
            });
        }
        else {
            this.setState((prev)=>({ explainContainerShow: !prev.explainContainerShow }));
        }
    }

    render() {
        return 
            <div>
                <CardPrimaryAction onClick={() => this.handleConditionClick()}>
                    <div style={{ padding: '1rem' }}>
                        <Typography use="headline" style={{ marginBottom: '10px' }}>{this.props.label}</Typography>
                        <Typography use="caption" tag="div">likelihood - {(this.props.probability * 100).toFixed(2)} %</Typography>
                        <LinearProgress progress={this.props.probability}></LinearProgress>
                        <ExplainContainer show={this.state.explainContainerShow}
                            supporting_evidence={this.state.explanation.supporting_evidence}
                            conflicting_evidence={this.state.explanation.conflicting_evidence} />
                    </div>
                </CardPrimaryAction>
                <ListDivider />
            </div>;
    }
}

class SingleQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
    }

    handleNext(choice_id) {
        var answers = [];
        answers.push({
            "id": this.props.question.items[0].id,
            "choice_id": choice_id,
            "name": this.props.question.items[0].name,
            "type": this.props.question.type,
            "text": this.props.question.text
        })
        this.props.handleNext(answers);
    }

    handlePrev() {
        this.props.handlePrev();
    }

    render() {
        var question = this.props.question.items[0];

        var questionsButtons = question.choices.map((choise) => {
            return <ChoiceButton key={choise.id + "_" + question.id} question={question} id={choise.id} label={choise.label} onClicked={this.handleNext} />
        });

        return <div className="group_multiple">
            <div className="question">{this.props.question.text}</div>

            <div className="answer-buttons">
                <Button onClick={this.handlePrev}>Back</Button>
                {questionsButtons}
            </div>
        </div>
    }
}

class GroupSingleQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.handleNext = this.handleNext.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
    }

    onChange(event, answerId) {
        var isChecked = event.target.checked;

        var answer = this.props.question.items.find((answer) => {
            return answer.id === answerId;
        });

        if (answer) {
            answer.selected = isChecked;
        }

        this.props.question.items.map((answer) => {
            if (answer.id != answerId) {
                answer.selected = false;
            }
        });
    }

    handleNext() {
        var selectedAnswers = this.props.question.items.filter((answer) => {
            return answer.selected === true;
        });

        if (selectedAnswers && selectedAnswers.length > 0) {
            var answers = [];

            for (var j = 0; j < selectedAnswers.length; j++) {
                answers.push({
                    "id": selectedAnswers[j].id,
                    "choice_id": "present",
                    "name": selectedAnswers[j].name,
                    "type": this.props.question.type,
                    "text": this.props.question.text
                })
            }

            this.props.handleNext(answers);
        }
    }

    handlePrev() {
        this.props.handlePrev();
    }

    render() {
        var questions = [].map((item) => {
            return <div></div>;
        });

        if (this.props.question && this.props.question.items && this.props.question.items.length > 0) {
            questions = this.props.question.items.map((answer) => {
                return <Radio label={answer.name} key={answer.id} value={answer.id} name="groupSingleQuestion" onChange={event=>this.onChange(event, answer.id)}></Radio>;
            });
        }

        return <div>
            <div className="question">{this.props.question.text}</div>

            <div>
                {questions}
            </div>


            <Button onClick={this.handlePrev}>Back</Button>
            <Button onClick={this.handleNext}>Next</Button>
        </div>
    }
}

class GroupMultipleQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
    }

    onChange(event, answerId) {
        var isChecked = event.target.checked;

        var answer = this.props.question.items.find((answer) => {
            return answer.id === answerId;
        });

        if (answer) {
            answer.selected = isChecked;
        }
    }

    handleNext() {
        if (this.props.question.items && this.props.question.items.length > 0) {
            var answers = [];

            for (var j = 0; j < this.props.question.items.length; j++) {
                var choice = this.props.question.items[j].selected ? "present" : "absent";
                answers.push({
                    "id": this.props.question.items[j].id,
                    "choice_id": choice,
                    "name": this.props.question.items[j].name,
                    "type": this.props.question.type,
                    "text": this.props.question.text
                })
            }

            this.props.handleNext(answers);
        }
    }
    handlePrev() {
        this.props.handlePrev();
    }
    render() {
        var questions = [].map((item) => {
            return <div></div>
        });

        if (this.props.question && this.props.question.items && this.props.question.items.length > 0) {
            questions = this.props.question.items.map((answer) => {
                return <ListItem key={answer.id + "_check"}><Checkbox key={answer.id} onChange={event=>this.onChange(event, answer.id)}>{answer.name}</Checkbox></ListItem>
            });
        }

        return <div className="group_multiple">
            <div className="question">{this.props.question.text}</div>
            <List>
                {questions}
            </List>

            <Button onClick={this.handlePrev}>Back</Button>
            <Button onClick={this.handleNext}>Next</Button>
        </div>
    }
}

class SymptomQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
    }
    handleNext(answers) {
        this.props.handleNext(answers);
    }
    handlePrev() {
        this.props.handlePrev();
    }
    render() {
        let questionType = this.props.question ? this.props.question.type : "";

        let question = undefined;

        switch (questionType) {
            case "group_multiple":
                question = <GroupMultipleQuestion question={this.props.question} handleNext={this.handleNext} handlePrev={this.handlePrev} />
                break;
            case "group_single":
                question = <GroupSingleQuestion question={this.props.question} handleNext={this.handleNext} handlePrev={this.handlePrev} />
                break;
            case "single":
                question = <SingleQuestion question={this.props.question} handleNext={this.handleNext} handlePrev={this.handlePrev} />
                break;
            default:
                question = null;
                break;
        }
        return this.props.show ? question : null;
    }
}

class CommonSymptoms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSymptoms: []
        };
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
    }

    onChange(event, symptomId) {
        var isChecked = event.target.checked;

        var symptom = this.props.commonSymptoms.find((symptom) => {
            return symptom.id === symptomId;
        });
        if (symptom) {
            symptom.selected = isChecked;
        }
    }
    handleNext() {
        var selectedSymptoms = this.props.commonSymptoms.filter((symptom) => {
            return symptom.selected === true;
        });

        if (selectedSymptoms && selectedSymptoms.length > 0) {
            var selections = [];

            for (var j = 0; j < selectedSymptoms.length; j++) {
                selections.push({
                    "id": selectedSymptoms[j].id,
                    "choice_id": "present",
                    "name": selectedSymptoms[j].name,
                    "text": "Do you have any of following symptoms?",
                    "type": "group_multiple"
                });
            }

            this.props.handleNext(selections, undefined);
        }
    }
    handlePrev() {
        this.props.handlePrev(undefined);
    }
    render() {
        var symptoms = this.props.commonSymptoms.map((symptom) => {
            return <ListItem key={symptom.id + "_check"}><Checkbox key={symptom.id} onChange={event => this.onChange(event, symptom.id)}>{symptom.name}</Checkbox></ListItem>;
        });

        return this.props.show ? (<div>
            <div className="question">Do you have any of following symptoms?</div>
            <List>
                {symptoms}
            </List>

            <Button onClick={this.handleNext}>Next</Button>
        </div>) : null;
    }
}

class PatientSymptomateResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = { explainNotRelevantDialogIsOpen: false };
    }
    render() {
        var diagnosticResult = this.props.diagnosticResult;

        var coditions = [].map((item) => {
            return <div></div>;
        })

        if (diagnosticResult && diagnosticResult.conditions) {
            var sortedConditions = diagnosticResult.conditions.sort((condition1, condition2) => {
                return condition1.probability < condition2.probability? 1:-1;
            }).slice(0, 5);

            coditions = sortedConditions.map((condition) => {
                return <ConditionResult style={{margin:"0 5px 5px 5px"}} key={condition.name}
                    label={condition.name}
                    probability={condition.probability}
                    diagnosticPost={this.props.diagnosticPost}
                    slotId={this.props.slotId}
                    targetId={condition.id}
                    openExplainNotRelevantDialog={() => this.setState({ explainNotRelevantDialogIsOpen: true})}
                ></ConditionResult>
            });
        }

        return this.props.show ? (<div>
            <Typography style={{width:'80vw',marginLeft:'auto', marginRight:'auto',marginBottom:'10px',textAlign:'center'}} tag="h3">SYMPTOM CHECKING RESULT</Typography>
            <Dialog
                open={this.state.explainNotRelevantDialogIsOpen}
                onClose={() => this.setState({ explainNotRelevantDialogIsOpen: false })}
            >
                <DialogTitle>Explanation</DialogTitle>
                    <DialogContent>Unfortunately the probability is to low the disease to be considered as diagnosis result.</DialogContent>
                    <DialogActions>
                        <DialogButton action="close">CLOSE</DialogButton>
                    </DialogActions>
            </Dialog>
            <Card style={{maxHeight:'72vh',overflowY:'scroll'}}>
                {coditions}
            </Card>
        </div>) : null;
    }
}

class PatientSymptomateComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.onFabClick = this.onFabClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAge = this.handleAge.bind(this);
    }

    getInitialState() {
        var N = 121;
        return {
            commonSymptoms: [],
            selections: [],
            selectionStep: 0,
            diagnostic: { "sex": "male", "age": "29", "evidence": [] },
            diagnosticResponse: {},
            showCommonSymptoms: false,
            showQuestion: false,
            showResult: false,
            evidences: [],
            emptyEvidence: {},
            slotId: undefined,
            optionGroups: { 
                age: Array.apply(null, { length: N }).map(Number.call, Number).slice(20),
                sex: ["Male", "Female"]
            },
            valueGroups: {age: 45, sex: "Male"}
        }
    }

    handleChange(name, value){
        this.setState(({valueGroups}) => ({
          valueGroups: {
            ...valueGroups,
            [name]: value
          }
        }));
    };

    getEmptyDiagnostic() {
        return this.state.emptyEvidence;
    }

    componentDidMount() {
        if(this.props.userData.dateOfBirth || (this.props.userData.age && this.props.userData.sex))
            symptomateService.getEmptyEvidence(this.props.userData, (error, result) => {
                symptomateService.getSymptoms((error, symptomsResult) => {
                    if (symptomsResult.length > 0) {
                        this.setState({ commonSymptoms: symptomsResult, showCommonSymptoms: true, emptyEvidence: result.data, diagnostic: result.data });
                    }
                });
            })
        
        this.props.actions.changeScreenTitle('Symptoms');
    }

    componentWillUpdate(){

    }

    buildDiagnostic(diagnostic) {
        var evidence = {
            sex: this.props.userData.sex.toLowerCase(),
            age: moment().diff(moment(Number(this.props.userData.dateOfBirth)), 'years'),
            evidence: []
        };

        for (var i = 0; i < diagnostic.evidence.length; i++) {
            evidence.evidence.push({
                id: diagnostic.evidence[i].id,
                choice_id: diagnostic.evidence[i].choice_id
            })
        }

        return evidence;
    }
    handleNext(selections) {
        if (this.state.selectionStep < numberOfPosts) {
            var prevDiagnostics = jQuery.extend(true, {}, this.state.diagnostic);

            var diagnostic = jQuery.extend(true, {}, prevDiagnostics);
            //diagnostic.evidence = [];
            for (var i = 0; i < selections.length; i++) {
                diagnostic.evidence.push(selections[i]);
            }

            symptomateService.sendDiagnosis(this.buildDiagnostic(diagnostic), (error, diagnosisResult) => {
                if (!error && diagnosisResult.success) {

                    var step = this.state.selectionStep + 1;
                    if (step > 0) {
                        this.setState({ showCommonSymptoms: false, showQuestion: true });
                    }
                    else {
                        this.setState({ showCommonSymptoms: true, showQuestion: false });
                    }

                    var question = undefined;
                    if (diagnosisResult.data && diagnosisResult.data.question) {
                        question = diagnosisResult.data.question;
                    }

                    this.setState((prevState)=>({ selectionStep: step, 
                        diagnostic: diagnostic, 
                        diagnosticResponse: diagnosisResult.data,
                        evidences: prevState.evidences.concat(prevDiagnostics),
                        question: question
                    }));
                }
            });
        }
        else {
            this.setState({ showCommonSymptoms: false, showQuestion: false, showResult: true });
            var result = {};

            if (this.state.diagnosticResponse && this.state.diagnosticResponse.conditions) {
                var sortedConditions = this.state.diagnosticResponse.conditions.sort((condition) => {
                    return condition.probability * -1;
                }).slice(0, 5);

                result = sortedConditions;
            }

            symptomateService.saveResultToStorage(this.state.slotId,
                result, this.state.diagnostic,
                this.props.userData.token,
                this.props.userData.email,
                (data) => {
                    $(".mdl-progress-top").css('visibility', 'hidden');
                });
        }
    }

    handlePrev() {
        if (this.state.selectionStep > 0) {

            var step = this.state.selectionStep - 1;
            this.setState({ selectionStep: step });

            if (step == 0) {
                this.setState(this.getInitialState());
                this.setState({ showCommonSymptoms: true });

            }
            else {
                var prevEvidence = this.state.evidences[this.state.evidences.length - 1];

                var tempArray = [];

                prevEvidence.evidence.map((ev) => {
                    tempArray.push({ id: ev.id, choice_id: ev.choice_id });
                });

                prevEvidence.evidence = tempArray;

                symptomateService.sendDiagnosis(prevEvidence, (error, diagnosisResult) => {
                    if (diagnosisResult.success) {
                        this.setState({ selectionStep: step, 
                            diagnostic: this.state.evidences[this.state.evidences.length - 1], 
                            diagnosticResponse: diagnosisResult.data,
                            question:diagnosisResult.data.question
                        });

                        this.state.evidences.pop();
                    }
                });
            }
        }
    }

    onFabClick() {
        if(!this.props.voiceState.microphoneOn) {
            this.props.actions.switchMicrophone();
        }
    }

    handleAge(){
        this.props.actions.updateUserData('sex',this.state.valueGroups.sex)
        this.props.actions.updateUserData('age',this.state.valueGroups.age);
        this.props.userData['sex'] = this.state.valueGroups.sex;
        this.props.userData['age'] = this.state.valueGroups.age;
        symptomateService.getEmptyEvidence(this.props.userData, (error, result) => {
            symptomateService.getSymptoms((error, symptomsResult) => {
                if (symptomsResult.length > 0) {
                    this.setState({ commonSymptoms: symptomsResult, showCommonSymptoms: true, emptyEvidence: result.data, diagnostic: result.data });
                }
            });
        })
    }

    render() {
        return this.props.userData.dateOfBirth || this.state.showCommonSymptoms
            ?(<Grid>
            <GridCell span="4">
                <div>
                    <CommonSymptoms show={this.state.showCommonSymptoms} commonSymptoms={this.state.commonSymptoms} handleNext={this.handleNext} handlePrev={this.handlePrev} />
                    <SymptomQuestions show={this.state.showQuestion} question={this.state.diagnosticResponse.question} ref={symptomQuestions => this.symptomQuestions = symptomQuestions} handleNext={this.handleNext} handlePrev={this.handlePrev} />
                    <PatientSymptomateResult show={this.state.showResult} diagnosticResult={this.state.diagnosticResponse} diagnosticPost={this.state.diagnostic} slotId={this.state.slotId} /> 
                    <Fab style={{ position: 'fixed', bottom: '12vh', right: '5vh' }} onClick={this.onFabClick} icon='settings_voice'></Fab>
                </div>
            </GridCell>
        </Grid>):
            (
            <div>
            <Card style={{ width: '21rem', marginTop:'5px', marginLeft:'auto', marginRight:'auto' }}>
                    <CardPrimaryAction>
                    <div style={{ marginTop: '1rem' }}>
                            <Typography style={{textAlign:'center'}} use="body1" tag="div" theme="text-secondary-on-background">Please provide your age and gender</Typography>
                        </div>
                    <Picker
                style={{width:'80vw'}}
                optionGroups={this.state.optionGroups}
                valueGroups={this.state.valueGroups}
                onChange={this.handleChange} />
                    </CardPrimaryAction>
                        <CardActions>
                            <CardActionButtons>
                               <CardAction onClick={() => this.handleAge()}>Next</CardAction>
                            </CardActionButtons>
                        </CardActions>
                </Card>
            
            </div>
            )
    }
}

const mapStateToProps = state => {
    return { userData: state.userData, voiceState: state.voiceState};
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const PatientSymptomate = connect(
    mapStateToProps,
    mapDispatchToProps
)(PatientSymptomateComponent);

export default PatientSymptomate;
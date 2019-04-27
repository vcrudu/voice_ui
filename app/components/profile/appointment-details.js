import React from 'react';
import apiService from '../../model/apiService';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryText,
    ListItemGraphic,
    ListItemMeta,
    ListDivider
} from '@rmwc/List';

import { TabBar, Tab, TabIcon, TabIconText, TabBarScroller } from '@rmwc/Tabs';

class AppointmentInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            appointmentTime: this.props.model ? this.props.model.slotDateTime : "",
            reasonText: this.props.model ? this.props.model.appointmentReason : ""
        };
    }

    render() {
        return <List twoLine>
            <SimpleListItem graphic="alarm" text={this.state.appointmentTime} secondaryText="time" meta="info" />
            <ListDivider />
            <SimpleListItem graphic="alarm" text={this.state.reasonText} secondaryText="reason" meta="info" />
            <ListDivider />
        </List>;
    }
}

class ProviderInfo extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return <List>
            <SimpleListItem graphic="person" text={this.props.model ? this.props.model.title + " " + this.props.model.name + " " + this.props.model.surname : ""} secondaryText="name" meta="info" />
            <ListDivider />
            <SimpleListItem graphic="message" text={this.props.model ? this.props.model.email : ""} secondaryText="email" meta="info" />
            <ListDivider />
            <ListItem>
                <ListItemGraphic>place</ListItemGraphic>
                <ListItemText>
                    {this.props.model && this.props.model.address.addressLine1 ? this.props.model.address.addressLine1 : ""}
                    {this.props.model && this.props.model.address.town ? ", " + this.props.model.address.town : ""}
                    {this.props.model && this.props.model.address.county ? ", " + this.props.model.address.county : ""}
                    {this.props.model && this.props.model.address.country ? ", " + this.props.model.address.country : ""}
                    {this.props.model && this.props.model.address.postCode ? ", " + this.props.model.address.postCode : ""}
                </ListItemText>
            </ListItem>
            <ListDivider />
            {
                this.props.model.contactDetails.map(function (contact) {
                    switch (contact.contactType) {
                        case "Phone":
                            return <div key="Phone">
                                <SimpleListItem graphic="local_phone" text={contact.contact} secondaryText="phone" meta="info" />
                                <ListDivider />
                            </div>;
                        case "Mobile":
                            return <div key="Mobile">
                            <SimpleListItem graphic="stay_current_portrait" text={contact.contact} secondaryText="mobile" meta="info" />
                                <ListDivider />
                            </div>;
                    }
                })
            }
        </List>;
    }
}

class AppointmentDetails extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeTab: undefined,
            providerInfo: undefined,
            appointmentInfo: undefined
        };
    }

    componentDidMount() {
        var component = this;

        var slotId = this.props.slotId;

        apiService.getProviderSlotById(slotId, function (error, slotResult) {
            if (!error) {

                var slotDate = moment(slotResult.slotDateTime).format("YYYY-MM-DD hh:mm");

                slotResult.slotDateTime = slotDate;

                component.setState({
                    appointmentInfo: slotResult
                });

                apiService.getProviderDetails(slotResult.providerId, function (error, result) {
                    if (!error) {
                        component.setState({
                            providerInfo: result
                        });

                        component.setState({ activeTab: 0 });
                    }
                });
            }
        });
    }

    onChange(tabId) {
        if (tabId == 0) {
            this.setState({ activeTab: tabId });
        }
        else if (tabId == 1) {
            this.setState({ activeTab: tabId });
        }
    }

    render() {
        var component = this;
        return <div>
            <div>
            <div className="primary-bg profile-image-container">
                    <img src="images/user.png" width="120" height="120" className="img-responsive center-block profile-user-photo" />
                    <div className="userName"><h4>{component.state.providerInfo ? component.state.providerInfo.title + " " + component.state.providerInfo.name + " " + component.state.providerInfo.surname : ""}</h4>
                    </div>
                </div>
                <TabBar
                activeTabIndex={this.state.activeTab}
                onChange={evt => this.onChange()}
                >
                <Tab>Appointment Info</Tab>
                <Tab>Provider Info</Tab>
                </TabBar>
            </div>
            <div>
            <section id="tab1">
                    <div className="page-content">
                        <div className="page-content-wrapper">
                            {(function () {
                                switch (component.state.activeTab) {
                                    case 0: return <AppointmentInfo model={component.state.appointmentInfo} />;
                                    case 1: return <ProviderInfo model={component.state.providerInfo} />;
                                }
                            })()}
                        </div>
                    </div>
                </section>
                <section id="tab2" className="hide"></section>
                </div>
        </div>;
    }
}

export default AppointmentDetails;

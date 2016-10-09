import React from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Form, Button, Checkbox } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Loader from 'react-loader';
import FormInput from '../components/forms/FormInput';
import { fetchDemoData, storeDemoData } from '../actions/index';
import { validateText, validateEmail, validateUsername, validate } from '../lib/validation';
import { getDemoData, isFetching } from '../reducers/index';

const generalFieldDefinitions = {
    username: { name: 'username', label: 'Username', type: 'text', disabled: false, required: true, component: FormInput, validate: validateUsername },
    email: { name: 'email', label: 'Email', type: 'text', disabled: false, required: true, component: FormInput, validate: validateEmail },
    optionalField: { name: 'optionalField', label: 'Optional Field', type: 'text', disabled: false, required: false, component: FormInput },
    disabledField: { name: 'disabledField', label: 'Disabled Field', type: 'text', disabled: true, required: false, component: FormInput },
};

const additionalFieldDefinitions = {
    anyDisabledField: { name: 'anyDisabledField', label: 'Any Disabled Field', type: 'text', disabled: true, required: false, component: FormInput, validate: validateText },
    otherRequiredField: { name: 'otherRequiredField', label: 'Other Required Field', type: 'text', disabled: false, required: true, component: FormInput, validate: validateText }
};

const getFieldDefinitionsAsArray = (fieldDefinitions) => {
    return Object.keys(fieldDefinitions).map((fieldDefinition) => fieldDefinitions[fieldDefinition]);
};

const renderFormFields = (fieldDefinitions) => {
    return (
        <div>
            {fieldDefinitions.map((fieldDefinition) => <Field key={fieldDefinition.name} {...fieldDefinition} />)}
        </div>
    );
};

class MyForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showAdditionalFields: false };
    }

    componentDidMount() {
        this.props.fetchDemoData();
    }

    saveFormData(data) {
        return this.props.storeDemoData(data);
    }

    toggleAdditionalFields() {
        this.setState({ showAdditionalFields: !this.state.showAdditionalFields });
    }

    render() {
        const {
            isFetching : isFetchingDemoData,
            handleSubmit,
            pristine,
            reset,
            submitting,
            submitSucceeded
        } = this.props;

        const { showAdditionalFields } = this.state;

        if (isFetchingDemoData) {
            return <Loader />
        }

        return (
            <Form horizontal onSubmit={handleSubmit(this.saveFormData.bind(this))}>
                <FieldArray
                    name='generalFields'
                    component={() => renderFormFields(getFieldDefinitionsAsArray(generalFieldDefinitions))} />
                <Checkbox
                    checked={showAdditionalFields}
                    onChange={() => this.toggleAdditionalFields()}>
                    Show Additional Fields
                </Checkbox>
                {showAdditionalFields ?
                    <FieldArray
                        name='additionalFields'
                        component={() => renderFormFields(getFieldDefinitionsAsArray(additionalFieldDefinitions))} /> :
                    null
                }
                <Button className='pull-left' bsStyle='primary' type='submit' disabled={submitting}>
                    {submitting ? <span><FontAwesome name='spinner' spin />&nbsp;</span> : null}
                    {submitSucceeded ? <span><FontAwesome name='check' />&nbsp;</span> : null}
                    Store data
                </Button>
                <Button className='pull-right' bsStyle='warning' disabled={pristine || submitting} onClick={reset}>
                    Reset data
                </Button>
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    initialValues: getDemoData(state),
    isFetching: isFetching(state)
});

const mapDispatchToProps = {
    fetchDemoData,
    storeDemoData
}

MyForm = reduxForm({
    form: 'myForm',
    validate: validate.bind(null, Object.assign({}, generalFieldDefinitions, additionalFieldDefinitions)),
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    destroyOnUnmount: false
})(MyForm);

MyForm = connect(mapStateToProps, mapDispatchToProps)(MyForm);

export default MyForm;

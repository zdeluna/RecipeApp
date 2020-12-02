import React from "react";
import { Button, Label, FormGroup, Input } from "reactstrap";

const FormField = props => {
    return (
        <div style={styles.formFieldWrapper}>
            <Text style={styles.labelText}>{props.label}</Text>
            <Input
                placeholder={props.placeholder}
                style={styles.formFieldText}
                onChange={event =>
                    props.handleFormValueChange(
                        props.formKey,
                        event.nativeEvent.text
                    )
                }
                {...props.textInputProps}
            />
        </div>
    );
};

const styles = StyleSheet.create({
    formFieldText: {
        fontSize: 20,
        borderRadius: 15,
        borderWidth: 1,
        padding: 12
    },
    labelText: {
        fontSize: 20,
        marginBottom: 12,
        paddingLeft: 10,
        paddingTop: 10
    }
});

export default FormField;

import React, { useState, useEffect } from "react";
import { Button, Row, Col, Container } from "reactstrap";
import "./Carousel.css";

const Carousel = props => {
    const [steps, setSteps] = useState([]);
    const [ingredientsInSteps, setIngredientsInSteps] = useState([
        {
            step: 0,
            ingredients: ["oil"]
        }
    ]);

    useEffect(() => {
        setSteps(props.steps);
        setIngredientsInSteps(props.ingredientsInSteps);
    });

    const [currentStep, setCurrentStep] = useState(0);

    const showNextIngredient = () => {
        let stepNumber = currentStep + 1;

        /* If the last step is showing, show the first step */
        if (stepNumber === steps.length) stepNumber = 0;

        setCurrentStep(stepNumber);
    };

    const showPreviousIngredient = () => {
        let stepNumber = setCurrentStep(currentStep - 1);

        /* If the first step is showing, show the last step*/
        if (stepNumber < 1) stepNumber = currentStep - 1;

        setCurrentStep(stepNumber);
    };

    const exit = () => {};

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Button
                            color="primary"
                            size="lg"
                            onClick={() => showPreviousIngredient()}
                        >
                            Previous
                        </Button>
                    </Col>
                    <Col>
                        <h3>
                            {currentStep + 1}/{steps.length}
                        </h3>
                    </Col>
                    <Col>
                        <Button
                            color="primary"
                            size="lg"
                            onClick={() => showNextIngredient()}
                        >
                            Next
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <h1>
                        {currentStep + 1}
                        ).
                        {steps[currentStep]}
                    </h1>
                </Row>
            </Container>
            <Container>
                <h5 id="ingredientsHeading">Ingredients</h5>
                {ingredientsInSteps[currentStep].ingredients.map(
                    (ingredient, index) => (
                        <h5 key={"ingredient" + index}>{ingredient}</h5>
                    )
                )}{" "}
            </Container>
        </div>
    );
};

export default Carousel;

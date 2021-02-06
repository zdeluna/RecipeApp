import React, { useContext, useState, useEffect } from "react";
import CategoryButton from "../../components/CategoryButton";
import { Redirect } from "react-router-dom";
import { Button, Row, Col, Container, Input } from "reactstrap";
import "./Category.css";
import { AuthContext } from "../../AuthProvider";

const Category = props => {
    const [categoryButtons, setCategoryButtons] = useState([]);

    const [category, setCategory] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const { user } = useContext(AuthContext);
    console.log(user);

    useEffect(
        () => {
            if (user && user.categories) {
                setCategoryButtons(user.categories);
            }
        },
        [user]
    );

    const handleClick = (e, id) => {
        setCategory(id);
        props.history.push(`/users/category/${id}`);
    };

    const handleChange = event => {
        let newCategories = [...categoryButtons];
        for (var i = 0; i < newCategories.length; i++) {
            if (newCategories[i].id == event.target.id) {
                newCategories[i].name = event.target.value;
            }
        }

        setCategoryButtons(newCategories);
    };

    const saveData = () => {
        setEditMode(false);
    };

    return (
        <Container>
            <Row>
                <h3 className="col-centered">Categories</h3>
                {editMode ? (
                    <Button
                        color="primary"
                        size="lg"
                        onClick={() => saveData()}
                    >
                        Save
                    </Button>
                ) : (
                    <Button
                        color="primary"
                        size="lg"
                        onClick={() => setEditMode(true)}
                    >
                        Edit
                    </Button>
                )}
            </Row>
            {editMode
                ? categoryButtons.map((categoryButton, index) => (
                      <Col key={categoryButton.id + "Column"}>
                          <Button color="primary" size="lg">
                              <Input
                                  id={categoryButton.id}
                                  type="text"
                                  value={categoryButton.name}
                                  onChange={handleChange}
                                  onBlur={handleChange}
                              />
                          </Button>
                      </Col>
                  ))
                : categoryButtons.map(categoryButton => (
                      <Col key={categoryButton.id + "Column"}>
                          <CategoryButton
                              key={categoryButton.id}
                              onClick={e => handleClick(e, categoryButton.id)}
                              value={categoryButton.name}
                          />
                      </Col>
                  ))}
        </Container>
    );
};

export default Category;

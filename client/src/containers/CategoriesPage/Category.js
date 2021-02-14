import React, { useContext, useState, useEffect } from "react";
import CategoryButton from "../../components/CategoryButton";
import Center from "../../components/Center";
import Right from "../../components/Right";
import { Redirect } from "react-router-dom";
import { Button, Row, Col, Container, Input } from "reactstrap";
import "./Category.css";
import { AuthContext } from "../../AuthProvider";
import { UPDATE_USER } from "../../api/mutations/user/updateUser";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER } from "../../api/queries/user/getUser";

const Category = props => {
    const [updateUser] = useMutation(UPDATE_USER);
    const [categoryButtons, setCategoryButtons] = useState([]);

    const [category, setCategory] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const { user, update } = useContext(AuthContext);
    const client = useApolloClient();
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
        update({ variables: { id: user.id, categories: categoryButtons } });
        const data = client.readQuery({
            query: GET_USER,
            variables: { id: user.id }
        });

        data.user.categories = categoryButtons;

        console.log("Before write query");
        console.log(data.user);

        client.writeQuery({
            query: GET_USER,
            variables: { id: user.id },
            data: { user: data.user }
        });
    };

    return (
        <Container>
            <Row>
                <Center>
                    <h3>Categories</h3>
                </Center>
                <Right>
                    {editMode ? (
                        <Button
                            color="secondary"
                            size="lg"
                            onClick={() => saveData()}
                        >
                            Save
                        </Button>
                    ) : (
                        <Button
                            color="secondary"
                            size="lg"
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </Button>
                    )}
                </Right>
            </Row>
            {editMode
                ? categoryButtons.map((categoryButton, index) => (
                      <Center>
                          <Row key={categoryButton.id + "Column"}>
                              <Col>
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
                          </Row>
                      </Center>
                  ))
                : categoryButtons.map(categoryButton => (
                      <Center>
                          <Row key={categoryButton.id + "Column"}>
                              <Col>
                                  <CategoryButton
                                      key={categoryButton.id}
                                      onClick={e =>
                                          handleClick(e, categoryButton.id)
                                      }
                                      value={categoryButton.name}
                                  />
                              </Col>
                          </Row>
                      </Center>
                  ))}
        </Container>
    );
};

export default Category;

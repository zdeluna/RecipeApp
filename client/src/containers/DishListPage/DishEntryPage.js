function withHook(Component) {
    return function WrappedComponent(props) {
        const dishInfo = {name: 'Tacos', category: '1'};
        return <Component {...props} dish={dishInfo} />;
    };
}

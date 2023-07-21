import styled from 'styled-components'

export const Outer = styled.div`
    @import url("https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap");
    font-family: "Roboto", sans-serif;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;
export const Header = styled.div`
    font-weight: 700;
    margin: 60px 0px 10px 0px;
`;
export const Form = styled.form`
    display: flex;
    flex-direction: column;
`;
export const Input = styled.input`
    border: 1px solid #333333;
    font-size: 16px;
    border-radius: 3px;
    margin: 10px 0px 0px 0px;
    padding: 5px;
`;
export const Button = styled.button`
    border: none;
    font-size: 16px;
    border-radius: 3px;
    margin: 10px 0px 0px 0px;
    padding: 5px;
    background: #2946CD;
    color: #FAFAFA;
    font-weight: 700;
`;
export const Message = styled.div`
    margin: 10px 0px;
`;
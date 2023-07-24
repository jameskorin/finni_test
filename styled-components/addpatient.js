import styled from 'styled-components'

export const Outer = styled.div`
    display: flex;
    flex-direction: column;
    @import url("https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap");
    font-family: "Roboto", sans-serif;
`;

export const Form = styled.form``;
export const Input = styled.input`
    font-size: 16px;
    border: 1px solid #E9EAEC;
    border-radius: 5px;
    padding: 3px 5px;
    color: #333333;
    margin: 10px;  
`;
export const SectionHeader = styled.div`
    margin: 20px 0px 0px 0px;
    font-size: 18px;
    font-weight: 500;
`;

export const Select = styled.select`
    font-size: 16px;
    border: 1px solid #E9EAEC;
    border-radius: 5px;
    padding: 3px 5px;
    color: #333333;
    margin: 10px;  
`;

export const AddButton = styled.button`
    border: none;
    background: #347EF6;
    color: #FAFAFA;
    float: right;
    border-radius: 5px;
    padding: 3px 5px;
    cursor: pointer;
`;

export const Section = styled.div`
    max-width: 700px;
    margin: 20px 0px 0px 0px;
`;

export const Address = styled.div`
    border-bottom: 1px solid #E9EAEC;
    margin: 5px 0px;
    padding: 5px 0px;
    position: relative;
`;
export const Addresses = styled.div`
    display: flex;
    flex-direction: column;

    :first-child {
        margin-top: 0px;
    }
`;
export const RemoveButton = styled.button`
    position: absolute;
    top: 20px;
    right: 0px;
`;

export const SaveButton = styled.button`
    width: 100%;
    max-width: 700px;
    border: none;
    background: #347EF6;
    color: #FAFAFA;
    font-weight: 700;
    border-radius: 5px;
    padding: 3px 5px;
    cursor: pointer;
    margin: 40px 0px 0px 0px;
    padding: 5px 20px;
`;
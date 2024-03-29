import styled, { css } from 'styled-components'

export const Outer = styled.div`
    color: #333333;
    font-size: 16px;

    @import url("https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap");
    font-family: "Roboto", sans-serif;
`;

export const Header = styled.div`
    font-weight: 700;
    font-size: 32px;
    margin: 10px 0px;
`;

export const SearchInput = styled.input`
    background: #FAFAFA;
    font-size: 16px;
    border: 1px solid #333333;
    border-radius: 5px;
    padding: 5px 10px;
    color: #333333;
    margin: 0px 0px 10px 0px;
`;

export const Message = styled.div`
    margin: 20px 0px;

    ${props => props.margin && css`
        margin: ${props => props.margin};
    `}
`;

export const Table = styled.table`
    border-collapse: collapse; 
    width: 850px;
    td {
        padding: 5px;
    }
    tr:not(:last-child) {
        border-bottom: 1px solid #E9EAEC;
    }
    th {
        text-align: left;
        padding: 5px;
    }
`;

export const Nav = styled.div`
    margin: 10px 0px;
`;

export const TopRow = styled.div`
    width: 100%;
    max-width: 850px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    div {
        display: flex;
        flex-direction: row;
        align-items: baseline;
    }
`;
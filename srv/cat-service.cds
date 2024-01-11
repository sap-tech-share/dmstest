service MyService {
    @cds.persistence.skip
    function TestFunction() returns String;
    action   TestAction()   returns String;

}

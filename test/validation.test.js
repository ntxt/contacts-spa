define("validationTest", ["validation"], function(validation){
 
    console.log("dupa");
 
    describe("Validation tests", function () {
     
        it("shows an error", function () {
            var contact = {
                firstName  : 'John',
                lastName   : 'Smith',
                email      : 'john@gmail.com',
                country    : 'PL'
            };
            expect(validation.check(contact).isOK).toBe(true);
        });
    });

});
<section class="signup-form">
    <h1>Signup</h1>
    <div class="form">
        <form method="post" action="http://localhost:8888/signup" class="small-12" data-abide>
            <div class="form__row">
                <input required name="login" type="text" placeholder="enter your login">
            </div>
            <div class="form__row">
                <input required name="email" type="email" placeholder="enter your email">
            </div>
            <div class="form__row">
                <input required name="password" id="signin__password" type="password" placeholder="enter your new password">
            </div>
            <div class="form__row">
                <input required data-parsley-equalto="#signin__password" data-parsley-error-message="This value should be the same as above." name="passwordConfirmation" type="password" placeholder="retype it">
            </div>
            <div class="form__actions">
                <input type="submit" value="Let me in!" class="button">
                <a href="#login" class="button secondary">Already have an account</a>
            </div>
        </form>
    </div>
</section>
<section class="login-form">
    <h1>Login</h1>
    <div class="form">
        <form method="post" action="http://localhost:8888/login" data-abide>
            <div class="form__row">
                <input required name="login" type="text" placeholder="enter your login">
            </div>
            <div class="form__row">
                <input required name="password" type="password" placeholder="enter your password">
            </div>
            <div class="form__actions">
                <input type="submit" value="Log me in" class="button">
                <a href="#signup" class="button secondary">Sign me up</a>
            </div>
        </form>
    </div>
</section>
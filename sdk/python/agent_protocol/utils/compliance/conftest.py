def pytest_addoption(parser):
    parser.addoption("--url", action="store", default="default name")


def pytest_generate_tests(metafunc):
    # This is called for every test. Only get/set command line arguments
    # if the argument is specified in the list of test "fixturenames".
    option_value = metafunc.config.option.url
    if "url" in metafunc.fixturenames and option_value is not None:
        metafunc.parametrize("url", [option_value])

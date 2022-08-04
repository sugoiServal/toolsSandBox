# url
> https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL


- URL stands for Uniform Resource Locator.
    - point to (address of) a given unique, published resource on the Web

![](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL/mdn-url-all.png)

## scheme
- indicates the protocol that the browser must use to request the resource
- Usually for websites the protocol is HTTPS or HTTP (its unsecured version)

## ://
- separator of scheme and authority
- The colon separates the scheme from the next part of the URL, while // indicates that the next part of the URL is the authority.

## Authority
- IP or Domain Name
-port number

## Path to resource
- the path to the resource on the Web server.
- In the early days of the Web, a path like this represented a physical file location
- Nowadays, it is mostly an abstraction handled by Web servers without any physical reality

# Parameters
- extra parameters provided to the Web server
- separated with the & symbol

# Anchor
- An anchor represents a sort of "bookmark" inside the resource, giving the browser the directions to show the content located at that "bookmarked" spot.
- Example: location in a document, timestamp in a video
- the part after the #, also known as the fragment identifier, is never sent to the server with the request. It directs the browser to do so.
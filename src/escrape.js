const defaultConfig = {
    keywords: {
        'article': 25,
        'body': 25,
        'content': 25,
        'entry': 25,
        'hentry': 25,
        'main': 25,
        'page': 25,
        'post': 25,
        'text': 25,
        'blog': 25,
        'story': 25,
        'column': 25,
        'attribution': -25,
        'combx': -25,
        'comment': -25,
        'contact': -25,
        'reference': -25,
        'foot': -25,
        'footer': -25,
        'footnote': -25,
        'infobox': -25,
        'masthead': -25,
        'media': -25,
        'meta': -25,
        'outbrain': -25,
        'promo': -25,
        'related': -25,
        'scroll': -25,
        'shoutbox': -25,
        'sidebar': -25,
        'sponsor': -25,
        'shopping': -25,
        'tags': -25,
        'tool': -25,
        'widget': -25,
        'community': -25,
        'disqus': -25,
        'extra': -25,
        'header': -25,
        'menu': -25,
        'remark': -25,
        'rss': -25,
        'shoutbox': -25,
        'sidebar': -25,
        'sponsor': -25,
        'ad-break': -25,
        'pagination': -25,
        'pager': -25,
        'popup': -25,
        'tweet': -25,
        'twitter': -25,
    },
    selectors: {
        blockDisplayStyles: ['block', 'flex', 'grid', 'inline-block', 'inline-flex'],
        blockTags: ['address', 'article', 'aside', 'blockquote', 'br', 'canvas', 'dd', 'div', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'p', 'pre', 'section', 'table', 'td', 'th', 'tr', 'thead', 'tfoot', 'ul', 'video'],

        readableTags: ['article', 'div', 'p', 'pre', 'section', 'span', 'td'],
        listItemTags: ['dl', 'dt', 'dd', 'li', 'ol', 'td', 'ul'],
        listableTags: ['dl', 'dt', 'dd', 'li', 'ol', 'p', 'span', 'td', 'ul'],        
        headingTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        metaTags: ['head', 'link', 'meta', 'noscript', 'script', 'style'],
        descriptiveTags: ['address', 'blockquote', 'cite', 'code', 'figcaption', 'form', 'label', 'output', 'pre', 'sup', 'tfoot'],
        interactiveTags: ['button', 'canvas', 'dialog', 'embed', 'figure', 'frame', 'iframe', 'img', 'input', 'menu', 'menuitem', 'nav', 'object', 'select', 'svg', 'textarea', 'video'],
        interactiveRoles: ['alert', 'alertdialog', 'banner', 'button', 'columnheader', 'combobox', 'dialog', 'directory', 'figure', 'heading', 'img', 'listbox', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'navigation', 'option', 'search', 'searchbox', 'status', 'toolbar', 'tooltip'],
        asideClasses: ['blogroll', 'caption', 'citation', 'comment', 'community', 'contact', 'copyright', 'extra', 'foot', 'footer', 'footnote', 'infobox', 'masthead', 'media', 'meta', 'metadata', 'mw-jump-link', 'mw-revision', 'navigation', 'navigation-not-searchable', 'noprint', 'outbrain', 'pager', 'popup', 'promo', 'reference', 'reference-text', 'references', 'related', 'related-articles', 'remark', 'rss', 's-popover', 'scroll', 'shopping', 'shoutbox', 'sidebar', 'sponsor', 'tag-cloud', 'tags', 'thumb', 'tool', 'user-info', 'widget', 'wikitable'],
    },
}

class Escrape {
    constructor(element, config = defaultConfig) {
        this.setConfig(config)
        this.element = element // document.createElement('body')
        this.iterator = 0
        // TODO: The next line messes up text inside of pre, input, etc.
        //this.element.innerHTML = this.collapseWhitespace(element.innerHTML)
    }

    setConfig(config) {
        this.config = {...defaultConfig, ...config}
    }

	getDescription(document) {
		const metas = this.element.querySelectorAll('meta[description],meta[name=description],meta[property=og\\:description]')
		for (const meta of metas) {
			if (meta.description)
				return meta.description
			if (meta.content)
				return meta.content
		}
		const shortDescription = this.element.querySelectorAll('.shortdescription')
		if (shortDescription.length == 1)
			return shortDescription[0].innerText // TODO: Convert to method?

		return ''
	}

	getTitle(document) {
		const h1s = this.element.querySelectorAll('h1')
		if (h1s.length == 1)
			return h1s[0].innerText // TODO: Convert to method?
		return document.title.split(' - ')[0].trim()
    }
    
    calculateTextFill(selector, node, iteration, baseText = null) {
        baseText ??= this.getNodeText(node, iteration)
        const baseTextLength = baseText.length
        const selectedNodes = node.querySelectorAll(selector)
        let selectedTextLength = 0
        for (const n of selectedNodes)
            selectedTextLength += this.getNodeText(n, iteration).length
        
        const unselectedTextLength = baseTextLength - selectedTextLength

        return {
            baseText,
            baseTextLength,
            selectedNodes,
            selectedTextLength,
            unselectedTextLength,
            textLengthRatio: baseTextLength ? selectedTextLength / baseTextLength : 0,
            nodePerChar: selectedNodes ? unselectedTextLength / selectedNodes.length : 0,
        }
    }

    isSelectorContainer(node, iteration, selector) {
        const text = this.getNodeText(node, iteration)
        if (text.length < 75) // TODO: //  || text.split(',').length < 5
            return true

        const fill = this.calculateTextFill(selector, node, iteration, text)
        if (fill.textLengthRatio > 0.4) // TODO:
            return true
        if (fill.nodePerChar > 1000) // TODO:
            return true
        return false
    }

    *getSelectorContainers(node, iteration, selector, title = '') {
        const nodes = [...node.querySelectorAll(selector)]
        const property = `_${title}State`

        let currentNode
        while (currentNode = nodes.shift()) {
            currentNode[property] = true

            const parent = currentNode.parentNode
            if (parent) {
                if (parent[property] != null)
                    continue
                if (parent[property] = this.isSelectorContainer(parent, iteration, selector))
                    nodes.push(parent)
            }
            yield currentNode
        }
    }

    *getHyperlinkContainers(node, iteration) {
        const selector = this.config.selectors.listableTags.join(',')
        const itemNodes = node.querySelectorAll(selector)
        for (const n of itemNodes) {
            const fill = this.calculateTextFill('a', node, iteration)
            if (fill.textLengthRatio > 0.4) // TODO:
                yield n
        }

        const divNodes = node.querySelectorAll('div>a,section>a') // TODO:
        for (const n of divNodes) {
            const parent = n.parentNode
            const fill = this.calculateTextFill('a', parent, iteration)
            if (fill.textLengthRatio > 0.4) // TODO:
                yield parent
        }
    }

    getReadableContainer(node = this.element) {
        const top = this.getReadableContainers(1, node)
        return top && top[0]
    }

    getReadableContainers(topN = null, node = this.element) {
        const readableSelector = this.config.selectors.readableTags.join(',')
        const visualSelector = this.config.selectors.descriptiveTags.join(',')
            + ',' + this.config.selectors.interactiveTags.join(',')
            + ',[role=' + this.config.selectors.interactiveRoles.join('],[role=') + ']'
            + ',.' + this.config.selectors.asideClasses.join(',.')

        const iteration = ++this.iterator
        for (const e of node.querySelectorAll(this.config.selectors.metaTags))
            this.setValue(e, iteration, 'nontext', true)
        for (const e of this.getSelectorContainers(node, iteration, visualSelector, 'visual'))
            this.setValue(e, iteration, 'nontext', true)
        for (const e of this.getHyperlinkContainers(node, iteration))
            this.setValue(e, iteration, 'nontext', true)

        let eligibleNodes = []
        const readableNodes = this.element.querySelectorAll(readableSelector)
        for (const n of readableNodes) {
            let weight = this.calculateWeight(n, iteration, visualSelector)
            if (!weight)
                continue

            let i = 2 // TODO:
            let p = n.parentNode
            
            while (p && --i) {
                let score = this.getValue(p, iteration, 'score')
                if (score == null) {
                    score = this.scoreContainer(p, iteration)
                    eligibleNodes.push(p)
                }
                this.setValue(p, iteration, 'score', score + weight)
                weight /= 2
                p = p.parentNode
            }
        }

        eligibleNodes = eligibleNodes.filter(n => this.getValue(n, iteration, 'score') > 0)
        eligibleNodes = eligibleNodes.sort((a,b) => this.getValue(b, iteration, 'score') - this.getValue(a, iteration, 'score'))
        eligibleNodes = eligibleNodes.slice(0, topN || eligibleNodes.length)
        return eligibleNodes
    }

    calculateWeight(node, iteration, selector) {
        const text = this.getNodeText(node, iteration)
        if (text.length < 25) // TODO:
            return 0
        const fill = this.calculateTextFill(selector, node, iteration, text)
        return 1
            + text.split(',').length
            + Math.min(text.length / 100, 3)
            + 1 - fill.textLengthRatio
    }

    scoreContainer(node, iteration) {
        const tagName = node.tagName.toLowerCase()
        const searchStr =`${node.className.toLowerCase()} ${node.id.toLowerCase()} ${tagName}`
        let score = 0
        for (const k in this.config.keywords)
            if (searchStr.includes(k))
                score += this.config.keywords[k]
        if (['div', 'p', 'section', 'article'].includes(tagName)) // TODO:
            score += 5
        else if (this.config.selectors.readableTags.includes(tagName))
            score += 3
        else if (this.config.selectors.listItemTags.includes(tagName))
            score -= 3
        this.setValue(node, iteration, 'score', score)
        return score
    }

	extractReadableContent(node, iteration) {
        // TODO: Write this method.

        // .replace(/ {2,}/g, ' ')
	    // .replace(/[\r\n\t]+/g, '\n')

        return this.getNodeText(node, iteration)
    }

    getNodeText(node, iteration, collapseWhitespace = true, lowercase = false) {
        let text = this.#getNodeText(node, iteration)
        if (collapseWhitespace)
            text = this.collapseWhitespace(text)
        if (lowercase)
            text = text.toLowerCase()
        return text
    }
    #getNodeText(node, iteration) {
        let text = ''
        let child = node.firstChild
        let isBlock = false

        while (child) {
            if (child.nodeType == Node.TEXT_NODE) {
                text += child.textContent.trim() + ' '
                isBlock = false
            } else if (child.nodeType == Node.ELEMENT_NODE && !this.getValue(child, iteration, 'nontext') && !this.isHidden(child)) {
                const lastBlock = isBlock
                isBlock = this.#isBlockElement(child)

                if (isBlock && !lastBlock)
                    text += '\n'

                text += this.#getNodeText(child, iteration)

                if (isBlock)
                    text += '\n'
            }
            child = child.nextSibling
        }
        return text
    }

    getNodeTextLength(node, iteration) {
        return this.#getNodeTextLength(node, iteration)
    }
    #getNodeTextLength(node, iteration) {
        let len = this.getValue(child, iteration, 'textlength') || 0
        if (len)
            return prop
        let child = node.firstChild

        while (child) {
            if (child.nodeType == Node.TEXT_NODE) {
                len += child.textContent.trim().length
            } else if (child.nodeType == Node.ELEMENT_NODE) {
                if (!this.isIgnored(child, iteration) && !this.isHidden(child)) {
                    const result = this.#getNodeTextLength(child, iteration)
                    this.setValue(child, iteration, 'textlength', result)
                    len += result
                }
            }
            child = child.nextSibling
        }
        return len
    }

    isIgnored(node, iteration) {
        return this.getValue(node, iteration, 'nontext')
    }

    ignore(node, iteration, ignore = true) {
        this.setValue(node, iteration, 'nontext', ignore)
        this.setValue(node, iteration, 'textlength', ignore ? 0 : undefined)
    }

    collapseWhitespace(str) {
        return str.replace(/\s+/g, ' ')
    }

    getValue(node, iteration, property) {
        if (node._escrape && node._escrape[iteration])
            return node._escrape[iteration][property]
    }

    setValue(node, iteration, property, value) {
        node._escrape ??= {}
        node._escrape[iteration] ??= {}
        node._escrape[iteration][property] = value        
    }

    isHidden(node) {
        return !node.offsetWidth && !node.getClientRects()
    }

    #isBlockElement(node = this.element) {
        const display = node.style.display.toLowerCase()
        return this.config.selectors.blockDisplayStyles.includes(display)
            || this.config.selectors.blockTags.includes(node.tagName.toLowerCase())
    }
}
